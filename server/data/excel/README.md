# College Data - Excel Files

## Instructions
Place your 16 Excel files containing college information in this folder.

## File Naming Convention
Use descriptive names like:
- `engineering_colleges.xlsx`
- `medical_colleges.xlsx`
- `commerce_colleges.xlsx`
- `arts_colleges.xlsx`
- `design_colleges.xlsx`
- etc.

## Required Excel Columns
Each Excel file should have these columns:

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| name | Text | Yes | College name |
| city | Text | Yes | City/Location |
| state | Text | Yes | State name |
| type | Text | Yes | Field (technology/medical/commerce/arts/design/science) |
| ownership | Text | Yes | government or private |
| website | URL | No | College website |
| latitude | Number | No | Latitude coordinate |
| longitude | Number | No | Longitude coordinate |
| ranking | Number | No | College ranking |
| description | Text | No | College description |

## Next Steps
1. Place all your Excel files here
2. Run the import script (will be created next)
3. Data will be imported into the colleges database table

## Notes
- Script will handle duplicates automatically
- Invalid rows will be logged but won't stop the import
- You'll get a detailed summary report after import
