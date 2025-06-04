# Triple Integral Visualizer

This project is a web application that visually represents the results of triple integrals based on user-defined functions. It utilizes Three.js for 3D rendering and provides an interactive interface for users to input their mathematical functions and integration limits.

## Features

- User-friendly input form for entering mathematical functions and limits.
- Real-time visualization of triple integral results in a 3D space.
- Interactive controls for zooming and rotating the 3D view.
- Calculation engine that parses and computes triple integrals.

## Project Structure

```
triple-integral-visualizer
├── src
│   ├── index.js               # Entry point of the application
│   ├── styles
│   │   └── main.css           # Styles for the application
│   ├── js
│   │   ├── visualization.js    # Handles rendering of the results
│   │   ├── mathEngine.js       # Performs calculations for the integrals
│   │   ├── uiController.js     # Manages user interactions
│   │   └── utils.js           # Utility functions
│   ├── lib
│   │   └── parser.js           # Parses user-inputted functions
│   └── components
│       ├── inputForm.js        # Manages the input form
│       ├── renderer.js         # Sets up the Three.js rendering logic
│       └── controls.js         # Manages user controls for the visualization
├── public
│   └── index.html              # Main HTML file for the application
├── package.json                # npm configuration file
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd triple-integral-visualizer
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Open your web browser and go to `http://localhost:3000`.

3. Enter your mathematical function and integration limits in the input form.

4. Click on the submit button to visualize the results of the triple integral.

## Examples

- Input: `f(x, y, z) = x^2 + y^2 + z^2`
- Integration Limits: `x: [0, 1], y: [0, 1], z: [0, 1]`

This will render the 3D representation of the integral result for the specified function and limits.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.