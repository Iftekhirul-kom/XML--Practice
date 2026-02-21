function loadConfig() {
  // Step 1: Fetch the XML file
    fetch('config.xml')
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load XML: ' + response.status);
        }
        return response.text(); // Get as text (XML is text-based)
        })
        .then(xmlText => {
        // Step 2: Parse the XML text into a DOM document
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Check for parse errors
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('XML parse error');
        }
        
        // Step 3: Extract values from XML
        const primaryColor = xmlDoc.getElementsByTagName('primaryColor')[0].textContent;
        const fontSize = xmlDoc.getElementsByTagName('fontSize')[0].textContent;
        const darkMode = xmlDoc.getElementsByTagName('darkMode')[0].textContent === 'true';
        const apiEndpoint = xmlDoc.getElementsByTagName('endpoint')[0].textContent;
        const timeout = xmlDoc.getElementsByTagName('timeout')[0].textContent;
        
        // Step 4: Apply the settings to the page
        document.body.style.backgroundColor = darkMode ? '#333' : '#fff'; // Dark or light
        document.body.style.color = darkMode ? '#fff' : '#000';
        document.body.style.fontSize = fontSize + 'px';
        document.querySelector('h1').style.color = primaryColor;
        
        // Display API info (for demo)
        const p = document.querySelector('p');
        p.textContent = `API Endpoint: ${apiEndpoint} | Timeout: ${timeout}ms`;
        
        console.log('Config loaded successfully!');
        })
        .catch(error => {
        console.error('Error loading config:', error);
        alert('Failed to load XML config. Check console for details.');
        });
}