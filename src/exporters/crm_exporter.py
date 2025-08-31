"""
CRM integration for exporting leads to various CRM systems
"""
import json
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime
from loguru import logger

from src.models.lead import Lead
from config.settings import CRM_CONFIGS


class CRMExporter:
    """Handles CRM integrations for lead export"""
    
    def __init__(self):
        self.crm_configs = CRM_CONFIGS
    
    def export_to_airtable(self, leads: List[Lead], base_id: str = None, table_name: str = "Leads") -> bool:
        """Export leads to Airtable"""
        try:
            from airtable import Airtable
            
            api_key = self.crm_configs['airtable']['api_key']
            base_id = base_id or self.crm_configs['airtable']['base_id']
            
            if not api_key or not base_id:
                logger.error("Airtable API key or base ID not configured")
                return False
            
            airtable = Airtable(base_id, table_name, api_key)
            
            # Convert leads to Airtable format
            records = []
            for lead in leads:
                record = self._format_lead_for_airtable(lead)
                records.append(record)
            
            # Batch insert (Airtable allows max 10 records per batch)
            batch_size = 10
            total_inserted = 0
            
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                try:
                    result = airtable.batch_insert(batch)
                    total_inserted += len(result)
                    logger.info(f"Inserted batch of {len(result)} records to Airtable")
                except Exception as e:
                    logger.error(f"Error inserting batch to Airtable: {e}")
            
            logger.info(f"Successfully exported {total_inserted} leads to Airtable")
            return total_inserted > 0
            
        except ImportError:
            logger.error("airtable-python-wrapper not installed. Run: pip install airtable-python-wrapper")
            return False
        except Exception as e:
            logger.error(f"Error exporting to Airtable: {e}")
            return False
    
    def export_to_hubspot(self, leads: List[Lead]) -> bool:
        """Export leads to HubSpot"""
        try:
            import hubspot
            from hubspot.crm.contacts import SimplePublicObjectInput
            
            api_key = self.crm_configs['hubspot']['api_key']
            
            if not api_key:
                logger.error("HubSpot API key not configured")
                return False
            
            client = hubspot.Client.create(access_token=api_key)
            
            total_inserted = 0
            
            for lead in leads:
                try:
                    contact_data = self._format_lead_for_hubspot(lead)
                    simple_public_object_input = SimplePublicObjectInput(properties=contact_data)
                    
                    api_response = client.crm.contacts.basic_api.create(
                        simple_public_object_input=simple_public_object_input
                    )
                    
                    total_inserted += 1
                    logger.debug(f"Created HubSpot contact: {lead.name}")
                    
                except Exception as e:
                    logger.warning(f"Error creating HubSpot contact for {lead.name}: {e}")
            
            logger.info(f"Successfully exported {total_inserted} leads to HubSpot")
            return total_inserted > 0
            
        except ImportError:
            logger.error("hubspot-api-client not installed. Run: pip install hubspot-api-client")
            return False
        except Exception as e:
            logger.error(f"Error exporting to HubSpot: {e}")
            return False
    
    def export_to_pipedrive(self, leads: List[Lead]) -> bool:
        """Export leads to Pipedrive"""
        try:
            api_token = self.crm_configs['pipedrive']['api_token']
            company_domain = self.crm_configs['pipedrive']['company_domain']
            
            if not api_token or not company_domain:
                logger.error("Pipedrive API token or domain not configured")
                return False
            
            base_url = f"https://{company_domain}.pipedrive.com/api/v1"
            headers = {'Content-Type': 'application/json'}
            
            total_inserted = 0
            
            for lead in leads:
                try:
                    person_data = self._format_lead_for_pipedrive(lead)
                    
                    # Create person in Pipedrive
                    response = requests.post(
                        f"{base_url}/persons?api_token={api_token}",
                        headers=headers,
                        json=person_data
                    )
                    
                    if response.status_code == 201:
                        total_inserted += 1
                        logger.debug(f"Created Pipedrive person: {lead.name}")
                    else:
                        logger.warning(f"Failed to create Pipedrive person for {lead.name}: {response.text}")
                        
                except Exception as e:
                    logger.warning(f"Error creating Pipedrive person for {lead.name}: {e}")
            
            logger.info(f"Successfully exported {total_inserted} leads to Pipedrive")
            return total_inserted > 0
            
        except Exception as e:
            logger.error(f"Error exporting to Pipedrive: {e}")
            return False
    
    def export_to_asana(self, leads: List[Lead], project_name: str = "Lead Generation") -> bool:
        """Export leads to Asana as tasks using REST API"""
        try:
            access_token = self.crm_configs['asana']['access_token']

            if not access_token:
                logger.error("Asana access token not configured")
                return False

            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }

            # Get user info
            me_response = requests.get('https://app.asana.com/api/1.0/users/me', headers=headers)
            if me_response.status_code != 200:
                logger.error(f"Failed to connect to Asana: {me_response.status_code}")
                return False

            me = me_response.json()['data']
            logger.info(f"Connected to Asana as: {me['name']}")

            # Get workspaces
            workspaces_response = requests.get('https://app.asana.com/api/1.0/workspaces', headers=headers)
            if workspaces_response.status_code != 200:
                logger.error("Failed to get Asana workspaces")
                return False

            workspaces = workspaces_response.json()['data']
            if not workspaces:
                logger.error("No Asana workspaces found")
                return False

            workspace_gid = workspaces[0]['gid']
            logger.info(f"Using workspace: {workspaces[0]['name']}")

            # Find or create project
            projects_response = requests.get(
                f'https://app.asana.com/api/1.0/projects?workspace={workspace_gid}',
                headers=headers
            )

            project_gid = None
            if projects_response.status_code == 200:
                projects = projects_response.json()['data']
                for project in projects:
                    if project['name'] == project_name:
                        project_gid = project['gid']
                        logger.info(f"Found existing project: {project_name}")
                        break

            if not project_gid:
                # Create new project
                project_data = {
                    'data': {
                        'name': project_name,
                        'workspace': workspace_gid,
                        'notes': 'Automatically generated leads from Instant Data Scraper'
                    }
                }

                create_response = requests.post(
                    'https://app.asana.com/api/1.0/projects',
                    headers=headers,
                    json=project_data
                )

                if create_response.status_code == 201:
                    project_gid = create_response.json()['data']['gid']
                    logger.info(f"Created new project: {project_name}")
                else:
                    logger.error(f"Failed to create project: {create_response.status_code}")
                    return False

            # Create tasks for each lead
            total_created = 0

            for lead in leads:
                try:
                    task_data = self._format_lead_for_asana_api(lead, project_gid)

                    task_response = requests.post(
                        'https://app.asana.com/api/1.0/tasks',
                        headers=headers,
                        json={'data': task_data}
                    )

                    if task_response.status_code == 201:
                        total_created += 1
                        logger.debug(f"Created Asana task: {lead.name}")
                    else:
                        logger.warning(f"Failed to create task for {lead.name}: {task_response.status_code}")

                except Exception as e:
                    logger.warning(f"Error creating Asana task for {lead.name}: {e}")

            logger.info(f"Successfully exported {total_created} leads to Asana project: {project_name}")
            return total_created > 0

        except Exception as e:
            logger.error(f"Error exporting to Asana: {e}")
            return False

    def export_to_google_sheets(self, leads: List[Lead], spreadsheet_id: str, sheet_name: str = "Leads") -> bool:
        """Export leads to Google Sheets"""
        try:
            import gspread
            from google.oauth2.service_account import Credentials
            
            # This would require Google Sheets API credentials
            # For now, we'll provide a placeholder implementation
            logger.warning("Google Sheets export requires additional setup with service account credentials")
            
            # Convert leads to rows
            headers = ['Name', 'Platform', 'Email', 'Phone', 'Website', 'Address', 'Industry', 'Lead Score', 'Source URL']
            rows = [headers]
            
            for lead in leads:
                row = [
                    lead.name,
                    lead.platform,
                    lead.email or '',
                    lead.phone or '',
                    lead.website or '',
                    lead.address or '',
                    lead.industry or '',
                    lead.lead_score,
                    lead.source_url
                ]
                rows.append(row)
            
            # Save as CSV for manual upload
            import csv
            from pathlib import Path
            
            csv_path = Path("exports") / f"google_sheets_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            csv_path.parent.mkdir(exist_ok=True)
            
            with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerows(rows)
            
            logger.info(f"Created CSV for Google Sheets import: {csv_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error preparing Google Sheets export: {e}")
            return False
    
    def _format_lead_for_airtable(self, lead: Lead) -> Dict[str, Any]:
        """Format lead data for Airtable"""
        return {
            'Name': lead.name,
            'Platform': lead.platform,
            'Email': lead.email,
            'Phone': lead.phone,
            'Website': lead.website,
            'Address': lead.address,
            'Industry': lead.industry,
            'Followers': lead.followers,
            'Engagement Rate': lead.engagement_rate,
            'Lead Score': lead.lead_score,
            'Pain Points': ', '.join(lead.pain_points) if lead.pain_points else None,
            'Social Handles': json.dumps(lead.social_handles) if lead.social_handles else None,
            'Source URL': lead.source_url,
            'Scraped At': lead.scraped_at.isoformat(),
            'Notes': lead.notes,
            'Tags': ', '.join(lead.tags) if lead.tags else None
        }
    
    def _format_lead_for_hubspot(self, lead: Lead) -> Dict[str, str]:
        """Format lead data for HubSpot"""
        properties = {
            'firstname': lead.name.split()[0] if lead.name else '',
            'lastname': ' '.join(lead.name.split()[1:]) if lead.name and len(lead.name.split()) > 1 else '',
            'email': lead.email or '',
            'phone': lead.phone or '',
            'website': lead.website or '',
            'address': lead.address or '',
            'industry': lead.industry or '',
            'hs_lead_status': 'NEW',
            'lifecyclestage': 'lead'
        }
        
        # Add custom properties
        properties.update({
            'platform_source': lead.platform,
            'lead_score_custom': str(lead.lead_score),
            'followers_count': str(lead.followers) if lead.followers else '',
            'pain_points': ', '.join(lead.pain_points) if lead.pain_points else '',
            'source_url': lead.source_url
        })
        
        # Remove empty values
        return {k: v for k, v in properties.items() if v}
    
    def _format_lead_for_asana_api(self, lead: Lead, project_gid: str) -> Dict[str, Any]:
        """Format lead data for Asana REST API"""
        # Create task name
        task_name = f"Lead: {lead.name}"

        # Create task notes with all lead information
        notes_parts = [
            f"**Lead Information**",
            f"Name: {lead.name}",
            f"Platform: {lead.platform}",
            f"Industry: {lead.industry or 'Not specified'}",
            f"Lead Score: {lead.lead_score}/100",
            "",
            f"**Contact Information**",
            f"Email: {lead.email or 'Not available'}",
            f"Phone: {lead.phone or 'Not available'}",
            f"Website: {lead.website or 'Not available'}",
            f"Address: {lead.address or 'Not available'}",
            "",
            f"**Social Media**",
            f"Followers: {lead.followers or 'Unknown'}",
            f"Engagement Rate: {lead.engagement_rate*100:.1f}%" if lead.engagement_rate else "Engagement Rate: Unknown",
        ]

        if lead.social_handles:
            notes_parts.append("Social Handles:")
            for platform, handle in lead.social_handles.items():
                notes_parts.append(f"  - {platform.title()}: {handle}")

        if lead.pain_points:
            notes_parts.extend([
                "",
                f"**Pain Points**",
                ", ".join([pp.replace('_', ' ').title() for pp in lead.pain_points])
            ])

        notes_parts.extend([
            "",
            f"**Source**",
            f"URL: {lead.source_url}",
            f"Scraped: {lead.scraped_at.strftime('%Y-%m-%d %H:%M')}",
        ])

        if lead.notes:
            notes_parts.extend([
                "",
                f"**Additional Notes**",
                lead.notes
            ])

        notes = "\n".join(notes_parts)

        # Create task data for API
        task_data = {
            'name': task_name,
            'notes': notes,
            'projects': [project_gid]
        }

        # Add due date (7 days from now for high priority, 14 days for others)
        from datetime import datetime, timedelta
        if lead.lead_score >= 70:
            due_date = datetime.now() + timedelta(days=7)
        else:
            due_date = datetime.now() + timedelta(days=14)

        task_data['due_on'] = due_date.strftime('%Y-%m-%d')

        return task_data

    def _format_lead_for_asana(self, lead: Lead, project_gid: str) -> Dict[str, Any]:
        """Format lead data for Asana task"""
        # Create task name
        task_name = f"Lead: {lead.name}"

        # Create task notes with all lead information
        notes_parts = [
            f"**Lead Information**",
            f"Name: {lead.name}",
            f"Platform: {lead.platform}",
            f"Industry: {lead.industry or 'Not specified'}",
            f"Lead Score: {lead.lead_score}/100",
            "",
            f"**Contact Information**",
            f"Email: {lead.email or 'Not available'}",
            f"Phone: {lead.phone or 'Not available'}",
            f"Website: {lead.website or 'Not available'}",
            f"Address: {lead.address or 'Not available'}",
            "",
            f"**Social Media**",
            f"Followers: {lead.followers or 'Unknown'}",
            f"Engagement Rate: {lead.engagement_rate*100:.1f}%" if lead.engagement_rate else "Engagement Rate: Unknown",
        ]

        if lead.social_handles:
            notes_parts.append("Social Handles:")
            for platform, handle in lead.social_handles.items():
                notes_parts.append(f"  - {platform.title()}: {handle}")

        if lead.pain_points:
            notes_parts.extend([
                "",
                f"**Pain Points**",
                ", ".join([pp.replace('_', ' ').title() for pp in lead.pain_points])
            ])

        notes_parts.extend([
            "",
            f"**Source**",
            f"URL: {lead.source_url}",
            f"Scraped: {lead.scraped_at.strftime('%Y-%m-%d %H:%M')}",
        ])

        if lead.notes:
            notes_parts.extend([
                "",
                f"**Additional Notes**",
                lead.notes
            ])

        notes = "\n".join(notes_parts)

        # Determine task priority based on lead score
        if lead.lead_score >= 80:
            priority = "high"
        elif lead.lead_score >= 60:
            priority = "medium"
        else:
            priority = "low"

        # Create task data
        task_data = {
            'name': task_name,
            'notes': notes,
            'projects': [project_gid],
            'priority': priority
        }

        # Add due date (7 days from now for high priority, 14 days for others)
        from datetime import datetime, timedelta
        if lead.lead_score >= 70:
            due_date = datetime.now() + timedelta(days=7)
        else:
            due_date = datetime.now() + timedelta(days=14)

        task_data['due_on'] = due_date.strftime('%Y-%m-%d')

        return task_data

    def _format_lead_for_pipedrive(self, lead: Lead) -> Dict[str, Any]:
        """Format lead data for Pipedrive"""
        return {
            'name': lead.name,
            'email': [{'value': lead.email, 'primary': True}] if lead.email else [],
            'phone': [{'value': lead.phone, 'primary': True}] if lead.phone else [],
            'org_id': None,  # Would need to create/find organization first
            'visible_to': '3',  # Visible to entire company
            'add_time': lead.scraped_at.isoformat(),
            'custom_fields': {
                'platform_source': lead.platform,
                'lead_score': lead.lead_score,
                'website': lead.website,
                'industry': lead.industry,
                'followers': lead.followers,
                'source_url': lead.source_url
            }
        }
    
    def export_to_multiple_crms(self, leads: List[Lead], crm_list: List[str]) -> Dict[str, bool]:
        """Export leads to multiple CRM systems"""
        results = {}

        for crm in crm_list:
            try:
                if crm.lower() == 'airtable':
                    results[crm] = self.export_to_airtable(leads)
                elif crm.lower() == 'hubspot':
                    results[crm] = self.export_to_hubspot(leads)
                elif crm.lower() == 'pipedrive':
                    results[crm] = self.export_to_pipedrive(leads)
                elif crm.lower() == 'asana':
                    results[crm] = self.export_to_asana(leads)
                elif crm.lower() == 'google_sheets':
                    results[crm] = self.export_to_google_sheets(leads, '')
                else:
                    logger.warning(f"Unknown CRM system: {crm}")
                    results[crm] = False

            except Exception as e:
                logger.error(f"Error exporting to {crm}: {e}")
                results[crm] = False

        return results
    
    def validate_crm_config(self, crm_name: str) -> bool:
        """Validate CRM configuration"""
        if crm_name.lower() not in self.crm_configs:
            return False

        config = self.crm_configs[crm_name.lower()]

        if crm_name.lower() == 'airtable':
            return bool(config.get('api_key') and config.get('base_id'))
        elif crm_name.lower() == 'hubspot':
            return bool(config.get('api_key'))
        elif crm_name.lower() == 'pipedrive':
            return bool(config.get('api_token') and config.get('company_domain'))
        elif crm_name.lower() == 'asana':
            return bool(config.get('access_token'))

        return False
