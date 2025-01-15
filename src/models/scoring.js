// model.js

const data = [
    { X: [3, 4, 1, 5], y: 7 },
    { X: [10, 5, 3, 12], y: 9 },
    { X: [1, 2, 0, 3], y: 4 },
    { X: [20, 6, 2, 15], y: 9 },
    { X: [5, 3, 1, 6], y: 7 },
    { X: [15, 4, 4, 10], y: 8 },
    { X: [7, 3, 2, 8], y: 7 },
    { X: [12, 6, 1, 14], y: 9 },
    { X: [2, 1, 0, 2], y: 3 },
    { X: [25, 5, 3, 18], y: 10 },
    { X: [8, 4, 0, 10], y: 8 },
    { X: [18, 2, 5, 9], y: 7 },
    { X: [4, 3, 1, 5], y: 6 },
    { X: [22, 6, 0, 20], y: 10 },
    { X: [10, 4, 2, 12], y: 8 },
    { X: [1, 2, 1, 3], y: 4 },
    { X: [15, 5, 4, 11], y: 8 },
    { X: [6, 3, 0, 7], y: 6 },
    { X: [30, 6, 0, 25], y: 10 },
    { X: [30, 6, 0, 0], y: 7 },
    { X: [5, 2, 3, 4], y: 5 },
    { X: [11, 4, 2, 9], y: 8 },
    { X: [14, 5, 1, 13], y: 9 },
    { X: [3, 1, 0, 1], y: 4 },
    { X: [20, 6, 0, 15], y: 10 },
    { X: [9, 3, 3, 10], y: 7 },
    { X: [13, 5, 2, 12], y: 9 },
  ];
  
  // Function to train and predict using the linear regression model
  const predict = (X_new, learningRate = 0.00063, epochs = 1000) => {
    // Initialize coefficients (weights) and intercept
    let b = Array(data[0].X.length + 1).fill(0); // Includes b_0 (intercept)
    let m = data.length;
  
    // Gradient Descent Loop for training the model
    for (let epoch = 0; epoch < epochs; epoch++) {
      let gradients = Array(b.length).fill(0);
  
      // Compute the gradients for each coefficient
      for (let i = 0; i < m; i++) {
        const { X, y } = data[i];
        const prediction = b[0] + X.reduce((sum, xi, idx) => sum + xi * b[idx + 1], 0); // b[0] is intercept
  
        // Calculate the error
        const error = prediction - y;
  
        // Update the gradients
        gradients[0] += error; // For the intercept (b_0)
        for (let j = 0; j < X.length; j++) {
          gradients[j + 1] += error * X[j]; // For b_1, b_2, ..., b_n
        }
      }
  
      // Update the coefficients using the gradients
      for (let j = 0; j < b.length; j++) {
        b[j] -= (learningRate / m) * gradients[j];
      }
    }
  
    // Once the model is trained, use the model to make a prediction on X_new
    const prediction = b[0] + X_new.reduce((sum, xi, idx) => sum + xi * b[idx + 1], 0);
    return prediction;
  };
  
  // Export the predict function
  export { predict };
  
  
  