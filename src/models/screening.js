// Screening ML Model
// model.js

const data = [
    { X: [1, 5, 1, 3], y: 1 },
    { X: [0, 9, 1, 9], y: 1 },
    { X: [1, 6, 0, 0], y: 0 },
    { X: [1, 2, 1, 0], y: 0 },
    { X: [1, 8, 1, 3], y: 1 },
    { X: [0, 7, 0, 1], y: 0 },
    { X: [1, 9, 1, 2], y: 1 },
    { X: [1, 6, 1, 0], y: 0 },
    { X: [0, 5, 0, 0], y: 0 },
    { X: [1, 10, 0, 4], y: 1 },
    { X: [1, 8, 1, 3], y: 1 },
    { X: [0, 7, 0, 1], y: 0 },
    { X: [1, 9, 1, 2], y: 1 },
    { X: [1, 6, 1, 0], y: 0 },
    { X: [0, 5, 0, 0], y: 0 },
    { X: [1, 10, 0, 4], y: 1 },
    { X: [0, 6, 1, 2], y: 0 },
    { X: [1, 7, 1, 5], y: 1 },
    { X: [0, 4, 0, 1], y: 0 },
    { X: [1, 8, 1, 3], y: 1 },
    { X: [0, 3, 1, 0], y: 0 },
    { X: [1, 6, 1, 2], y: 0 },
    { X: [1, 9, 1, 4], y: 1 },
    { X: [0, 5, 0, 1], y: 0 },
    { X: [1, 7, 1, 6], y: 1 },
    { X: [1, 8, 0, 2], y: 1 },
    { X: [0, 2, 0, 0], y: 0 },
    { X: [1, 10, 1, 5], y: 1 },
    { X: [0, 6, 1, 1], y: 0 },
    { X: [1, 9, 0, 3], y: 1 },
    { X: [0, 10, 0, 10], y: 0},
];

const sigmoid = (x) => {
  // Sigmoid function: maps values to the range (0, 1)
  return 1 / (1 + Math.exp(-x));
};

const classify = (X_new, learningRate = 0.00063, epochs = 1000) => {
  // Initialize coefficients (weights) and intercept
  let b = Array(data[0].X.length + 1).fill(0); // Includes b_0 (intercept)
  let m = data.length;

  // Gradient Descent Loop for training the model
  for (let epoch = 0; epoch < epochs; epoch++) {
    let gradients = Array(b.length).fill(0);

    // Compute the gradients for each coefficient
    for (let i = 0; i < m; i++) {
      const { X, y } = data[i];
      const linearPrediction = b[0] + X.reduce((sum, xi, idx) => sum + xi * b[idx + 1], 0); // b[0] is intercept

      // Apply sigmoid function to get probability
      const prediction = sigmoid(linearPrediction);

      // Calculate the error (difference between predicted and actual label)
      const error = prediction - y;

      // Update the gradients
      gradients[0] += error; // For the intercept (b_0)
      for (let j = 0; j < X.length; j++) {
        gradients[j + 1] += error * X[j]; // For b_1, b_2, ..., b_n
      }
    }

    // Update the coefficients using the gradients
    for (let j = 0; j < b.length; j++) {
      b[j] -= (learningRate / m) * gradients[j]; // Apply gradient descent
    }
  }

  // Once the model is trained, use the model to make a prediction on X_new
  const linearPrediction = b[0] + X_new.reduce((sum, xi, idx) => sum + xi * b[idx + 1], 0);
  const prediction = sigmoid(linearPrediction); // Apply sigmoid to the linear prediction

  // Return 1 if the prediction is >= 0.5, otherwise return 0
  return prediction >= 0.5 ? 1 : 0;
};

// Export the predict function
export { classify };
