
# Vision Bridge - YAML DOM Manipulator

A JavaScript application that dynamically modifies webpages based on YAML configuration files.

## Setup and Installation

1. Clone the repository
2. Start a local web server (required for ES6 modules):
   ```bash
   # Using VS Code Live Server extension
   Right-click index.html -> "Open with Live Server"
   ```

## How to Use

1. **Load HTML**: Click "HTML Dosyası Seç" to upload an HTML file or use "Örnek HTML Yükle" for sample data
2. **Load YAML**: Click "YAML Dosyaları Seç" to upload configuration files or use "Örnek YAML Ekle" for testing
3. **Apply Changes**: Click "YAML'ları Uygula" to execute all configurations
4. **View Results**: See changes in real-time preview and check logs for details

## Code Structure

```
├── index.html              # Main application interface
├── src/
│   ├── main.js            # Application entry point
│   ├── core/
│   │   ├── yamlParser.js  # YAML parsing and validation
│   │   ├── actionHandler.js # Action execution engine
│   │   └── domManipulator.js # DOM manipulation operations
│   ├── ui/
│   │   └── logger.js      # Logging system
│   └── utils/
│       └── helpers.js     # Utility functions
├── assets/styles/
│   └── main.css           # Main stylesheet
└── examples/
    ├── e-commerce.html    # Sample HTML file
    └── e-commerce.yaml    # Sample YAML configuration
```

## Supported Actions

### Remove
```yaml
- type: remove
  selector: ".ad-banner"
```

### Replace
```yaml
- type: replace
  selector: "#old-header"
  newElement: "<header id='new-header'>New Header</header>"
```

### Insert
```yaml
- type: insert
  position: "after"  # before, after, prepend, append
  target: "body"
  element: "<footer>Footer Content</footer>"
```

### Alter
```yaml
- type: alter
  oldValue: "Machine Learning"
  newValue: "AI"
```

## Implementation Details

- **ES6 Modules**: Modular code structure for maintainability
- **Multiple YAML Support**: Handles multiple configuration files with priority logic
- **Error Handling**: Comprehensive error catching and user-friendly messages
- **Iframe Sandbox**: Safe DOM manipulation environment
- **Real-time Preview**: Instant visual feedback of changes

## Assumptions and Limitations

- **Browser Compatibility**: Designed for modern browsers supporting ES6 modules and iframe sandbox features
- **Local Server Required**: Must run on HTTP/HTTPS server due to ES6 module imports (file:// protocol not supported)
- **YAML Structure**: Each YAML file must have a root `actions` array with valid action objects
- **Action Dependencies**: Actions are processed sequentially - later actions may fail if they depend on elements removed by earlier actions
- **Text Replacement**: `alter` action performs global text replacement which may affect unintended content
- **Single Document**: Currently handles one HTML document at a time, no multi-page support

## Challenges Faced

1. **YAML Parsing Complexity**: Initially struggled with js-yaml library integration and handling malformed YAML files. Solved by implementing comprehensive validation and error catching mechanisms.

2. **Multiple Action Processing**: Managing the sequence of actions and ensuring they don't interfere with each other was challenging. Resolved by processing actions sequentially and updating the DOM state after each operation.

3. **DOM Element Selection**: CSS selectors sometimes failed when elements were dynamically modified by previous actions. Fixed by re-querying elements for each action instead of caching references.

4. **File Upload Handling**: Managing multiple YAML files and displaying their contents properly required careful state management. Implemented a robust file processing system with progress tracking.

5. **Error User Experience**: Making technical errors understandable for users while maintaining detailed logging for debugging. Created a dual-layer logging system with user-friendly messages and technical details.

The application successfully implements all required features including YAML parsing, DOM manipulation, multiple configuration handling, and provides a user-friendly interface for testing and validation.
