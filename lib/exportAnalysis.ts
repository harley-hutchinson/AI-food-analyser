import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

export const exportAnalysisAsJSON = async (analysis: any) => {
  try {
    const fileUri = FileSystem.documentDirectory + "food-analysis.json";
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(analysis, null, 2)
    );
    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error("Error exporting JSON:", error);
  }
};

export const exportAnalysisAsPDF = async (analysis: any) => {
  try {
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { font-size: 22px; margin-bottom: 10px; }
            h2 { font-size: 18px; margin-top: 20px; }
            p, li { font-size: 14px; line-height: 1.5; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${analysis.identifiedFood}</h1>

          <h2>Portion Information</h2>
          <p><strong>Portion Size:</strong> ${analysis.portionSize}g</p>
          <p><strong>Serving Size:</strong> ${
            analysis.recognizedServingSize
          }g</p>

          <h2>Nutrition Facts (Per Portion)</h2>
          <ul>
            <li><strong>Calories:</strong> ${
              analysis.nutritionFactsPerPortion.calories
            }</li>
            <li><strong>Protein:</strong> ${
              analysis.nutritionFactsPerPortion.protein
            }g</li>
            <li><strong>Carbs:</strong> ${
              analysis.nutritionFactsPerPortion.carbs
            }g</li>
            <li><strong>Fat:</strong> ${
              analysis.nutritionFactsPerPortion.fat
            }g</li>
            <li><strong>Fiber:</strong> ${
              analysis.nutritionFactsPerPortion.fiber
            }g</li>
            <li><strong>Sugar:</strong> ${
              analysis.nutritionFactsPerPortion.sugar
            }g</li>
            <li><strong>Sodium:</strong> ${
              analysis.nutritionFactsPerPortion.sodium
            }mg</li>
            <li><strong>Cholesterol:</strong> ${
              analysis.nutritionFactsPerPortion.cholesterol
            }mg</li>
          </ul>

          <h2>Additional Notes</h2>
          <ul>
            ${analysis.additionalNotes
              .map((note: string) => `<li>${note}</li>`)
              .join("")}
          </ul>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};
