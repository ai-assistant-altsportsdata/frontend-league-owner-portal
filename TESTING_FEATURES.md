# Testing Features - League Owner Portal

This document describes the testing features built into the League Owner Portal for easier development and testing.

## Auto-Fill Features

### 1. League Information Auto-Fill

**Location**: Step 1 of the onboarding process (League Information form)

**Button**: "Auto-Fill Test Data" (yellow button with lightning icon)

**What it does**:
- Automatically fills all required form fields with sample data
- Clears any existing validation errors
- Uses realistic sample data for a basketball league

**Sample Data Filled**:
- **League Name**: Metro Basketball League
- **Sport**: Basketball
- **Established Year**: 2020
- **League Tier**: Amateur
- **Description**: A competitive amateur basketball league serving the metropolitan area with teams from various neighborhoods.
- **Website**: https://metrobasketball.com
- **Contact Name**: John Smith
- **Contact Email**: admin@metrobasketball.com
- **Country**: United States
- **State/Region**: California
- **City**: San Francisco

### 2. File Upload Auto-Fill

**Location**: Step 2 of the onboarding process (File Upload)

**Button**: "Add Test Files" (yellow button with lightning icon)

**What it does**:
- Adds three mock files to simulate uploaded league data
- Each file shows realistic upload progress animation
- Files are marked as completed after upload simulation

**Mock Files Added**:
1. **players.csv** (45KB)
   - Sample player data with stats, positions, and performance metrics
   
2. **games.json** (32KB)
   - Game results, scores, and match statistics
   
3. **teams.xlsx** (28KB)
   - Team information, roster details, and standings

## Usage Instructions

### For Testing the Complete Flow:

1. **Start the development server**:
   ```bash
   cd frontend-001-nextjs-leage-owner-portal
   npm run dev
   ```

2. **Open the application**: Navigate to `http://localhost:3210`

3. **Step 1 - League Information**:
   - Click the "Auto-Fill Test Data" button in the top-right of the form
   - All form fields will be populated with sample data
   - Click "Continue to File Upload" to proceed

4. **Step 2 - File Upload**:
   - Click the "Add Test Files" button in the top-right
   - Watch as three files are added and show upload progress
   - Wait for all files to complete uploading
   - Click "Process Files" to continue

5. **Continue through remaining steps** to test the complete onboarding flow

## Visual Indicators

- **Auto-fill buttons** have a distinctive yellow styling with lightning bolt icons
- **Buttons are disabled** when appropriate (e.g., file upload button disabled when max files reached)
- **Progress animations** show realistic upload simulation for test files
- **Form validation** is automatically cleared when using auto-fill

## Development Notes

- Auto-fill functions are only for testing/development purposes
- Mock files contain placeholder content, not actual CSV/JSON/Excel data
- Upload simulation uses random progress intervals to mimic real file uploads
- All sample data uses realistic formats and validation-compliant values

## Customizing Test Data

To modify the test data, edit the following files:

- **League form data**: `src/components/forms/LeagueInfoForm.tsx` (autoFillTestData function)
- **Mock files data**: `src/components/dropzone/FileDropzone.tsx` (addTestFiles function)

## Troubleshooting

- If auto-fill buttons don't appear, check that the components are properly imported
- If file upload simulation doesn't work, check browser console for errors
- Ensure all required dependencies are installed (`npm install`)

