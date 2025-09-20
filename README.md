# League Dropbox Onboarding - Progressive Enhancement App

A modern, progressive enhancement dropbox onboarding application for sports leagues with comprehensive data schema visualization and dashboard preview.

## Features

### 🎯 Progressive Enhancement Dropbox
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **File Validation**: Real-time validation for CSV, JSON, and Excel files
- **Upload Progress**: Visual progress indicators with status updates
- **Error Handling**: Comprehensive error messages and retry functionality

### 📊 Data Schema Visualization
- **Interactive Schema Tree**: Expandable/collapsible data structure visualization
- **Type Detection**: Automatic detection of data types (string, number, date, email, etc.)
- **Schema Statistics**: Field counts, depth analysis, and complexity metrics
- **Visual Representation**: Color-coded schema nodes with icons and examples

### 🏆 League Onboarding Workflow
- **5-Step Process**: Guided onboarding with progress tracking
- **Form Validation**: Real-time validation with helpful error messages
- **State Management**: Persistent state using Zustand store
- **Step Navigation**: Easy navigation between onboarding steps

### 📈 Dashboard Preview
- **Multi-Tab Interface**: Overview, Data Summary, Schema Details, and Insights
- **Integration Readiness**: Scoring system for data quality and compatibility
- **AI Recommendations**: Smart suggestions for data optimization
- **Statistics Dashboard**: Comprehensive analytics and metrics

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 RC with Tailwind CSS
- **Animations**: Framer Motion for smooth transitions
- **State Management**: Zustand for lightweight state management
- **File Handling**: React Dropzone for file uploads
- **Icons**: Lucide React for consistent iconography
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for backend functionality
│   ├── globals.css        # Global styles and Tailwind setup
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main onboarding page
├── components/            # React components
│   ├── dashboard/         # Dashboard preview components
│   ├── dropzone/          # File upload components
│   ├── forms/             # Form components
│   ├── onboarding/        # Onboarding workflow components
│   ├── processing/        # Data processing components
│   ├── schema/            # Schema visualization components
│   └── ui/                # Base UI components
├── lib/                   # Utility functions
├── stores/                # Zustand state management
└── types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open application**:
   Visit http://localhost:3210 in your browser

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

The application includes several API endpoints for backend functionality:

- `POST /api/league` - Save league information
- `GET /api/league?id={leagueId}` - Retrieve league data
- `POST /api/upload` - Handle file uploads
- `POST /api/process` - Process uploaded files and generate schemas

## Onboarding Flow

### Step 1: League Information
- Collect basic league details (name, sport, contact info)
- Location and tier classification
- Form validation and error handling

### Step 2: File Upload
- Drag & drop file interface
- Support for CSV, JSON, and Excel files
- Real-time upload progress and validation

### Step 3: Data Processing
- Automatic data parsing and analysis
- Schema generation from uploaded files
- Processing status with visual feedback

### Step 4: Schema Review
- Interactive schema visualization
- Data structure validation
- Edit and approval workflow

### Step 5: Dashboard Preview
- Complete dashboard preview with multiple tabs
- Integration readiness scoring
- AI-powered recommendations and insights

## Progressive Enhancement Features

### File Upload Enhancement
- **Drag & Drop**: Native HTML5 drag and drop API
- **Visual Feedback**: Hover states and drop zones
- **File Validation**: Client-side validation before upload
- **Preview Generation**: Automatic preview of data structure

### Data Processing Enhancement
- **Real-time Processing**: Live progress updates during data analysis
- **Error Recovery**: Automatic retry mechanisms
- **Schema Inference**: AI-powered data type detection
- **Preview Generation**: Sample data preview for verification

### Dashboard Enhancement
- **Interactive Visualizations**: Dynamic charts and graphs
- **Real-time Updates**: Live data synchronization
- **Export Capabilities**: Data export and report generation
- **Integration Readiness**: Compatibility scoring system

## Customization

### Styling
The application uses Tailwind CSS with a custom design system. Modify `tailwind.config.js` and `globals.css` to customize the appearance.

### Schema Visualization
The schema visualization component is highly customizable. You can modify colors, icons, and layout in `SchemaVisualization.tsx`.

### Onboarding Steps
Add or modify onboarding steps by updating the `ONBOARDING_STEPS` array in `src/stores/onboarding.ts`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimized loading
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Progressive Loading**: Lazy loading of components and data

## Security Features

- **File Type Validation**: Server-side validation of uploaded files
- **Size Limits**: Maximum file size enforcement (50MB)
- **Input Sanitization**: All form inputs are validated and sanitized
- **CORS Protection**: Proper CORS headers for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the AltSports League Intelligence Platform.

## Support

For questions or support, please contact the development team or refer to the main project documentation.