export const ai_prompt_v1 = `Analyze this food image and provide detailed nutritional information in the following JSON format:
    {
      "foodAnalysis": {
        "identifiedFood": "Name and detailed description of what you see in the image",
        "portionSize": "Estimated portion size in grams",
        "recognizedServingSize": "Estimated serving size in grams",
        "nutritionFactsPerPortion": {
          "calories": "Estimated calories",
          "protein": "Estimated protein in grams",
          "carbs": "Estimated carbs in grams",
          "fat": "Estimated fat in grams",
          "fiber": "Estimated fiber in grams",
          "sugar": "Estimated sugar in grams",
          "sodium": "Estimated sodium in mg",
          "cholesterol": "Estimated cholesterol in mg"
        },
        "nutritionFactsPer100g": {
          "calories": "Calories per 100g",
          "protein": "Protein in grams per 100g",
          "carbs": "Carbs in grams per 100g",
          "fat": "Fat in grams per 100g",
          "fiber": "Fiber in grams per 100g",
          "sugar": "Sugar in grams per 100g",
          "sodium": "Sodium in mg per 100g",
          "cholesterol": "Cholesterol in mg per 100g"
        },
        "additionalNotes": [
          "Any notable nutritional characteristics",
          "Presence of allergens",
          "Whether it's vegetarian/vegan/gluten-free if applicable"
        ]
      }
    }
      
    Ensure the response is in valid JSON format exactly as specified above, without any markdown formatting.
    Provide realistic estimates based on typical portion sizes and nutritional databases.
    Be as specific and accurate as possible in identifying the food and its components.
    Make sure to calculate both portion-based and per 100g nutritional values for easy comparison.`;
