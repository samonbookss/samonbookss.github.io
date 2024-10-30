<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Parser</title>
  <script>
    const parsedJsonDocumentExample = {
      "titleModule": {
          "subject": "USB güvenli şarj ile taşınabilir GÜNEŞ PANELI 5V 2W güneş plaka Stabilize pil şarj cihazı güç banka telefon açık kamp için ev",
          "feedbackRating": {
              // "averageStar": "4.1",
              // "totalValidNum": 1027,
              // "tradeCount": "5000+"
          },
          // "tradeCount": "5000+",
          // "formatTradeCount": "5000+",
          "storeModule": {
              // "openTime": 1695710841000,
              // "positiveRate": "86.9",
              // "topRatedSeller": false
          }
      },
      "storeModule": {
          // "openTime": 1695710841000,
          // "positiveRate": "86.9",
          "topRatedSeller": false,
          "storeURL": "//tr.aliexpress.com/store/1103187308",
          "storeName": "3c Consumer Electronics Accessories Store",
          // "followingNumber": 2256,
          "openedYear": "Eyl 25, 2023"
      },
      "commonModule": {
          "description": "USB güvenli şarj ile taşınabilir GÜNEŞ PANELI 5V 2W güneş plaka Stabilize pil şarj cihazı güç banka telefon açık kamp için ev\nGÜNEŞ PANELI, dayanıklı ve uzun bir servis ömrüne sahip olan yüksek kaliteli alüminyum alaşımlı malzeme 'den yapılmıştır.\n✓ Ücretsiz Kargo Worldwide tadını çıkarın! ✓ Sınırlı Zaman Satış ✓ Kolay Dönüş",
          "keywords": "Taşınabilir GÜNEŞ PANELI,Pil şarj cihazı,2W 5V GÜNEŞ PANELI şarj cihazı,Güneş panelleri"
      },
      "imageModule": {
          "imagePathList": [
              "https://ae01.alicdn.com/kf/Sb4483b952e124cb599f5db827a931182g/USB-g-venli-arj-ile-ta-nabilir-G-NE-PANELI-5V-2W-g-ne-plaka-Stabilize.jpg",
              "https://ae01.alicdn.com/kf/S923ce14724fa4390871287ce0dc1dee3o/USB-g-venli-arj-ile-ta-nabilir-G-NE-PANELI-5V-2W-g-ne-plaka-Stabilize.jpg",
              "https://ae01.alicdn.com/kf/Sf2022a46011148ab9f9e955d6f64327b3/USB-g-venli-arj-ile-ta-nabilir-G-NE-PANELI-5V-2W-g-ne-plaka-Stabilize.jpg",
              "https://ae01.alicdn.com/kf/Sae6c62abed914d2f93ff017a3c205bbdj/USB-g-venli-arj-ile-ta-nabilir-G-NE-PANELI-5V-2W-g-ne-plaka-Stabilize.jpg",
              "https://ae01.alicdn.com/kf/S17a040f6b50d4132b338d967cc8db012A/USB-g-venli-arj-ile-ta-nabilir-G-NE-PANELI-5V-2W-g-ne-plaka-Stabilize.jpg",
              "https://ae01.alicdn.com/kf/S1211f9bd57574111a4237389acd42e8fT/USB-g-venli-arj-ile-ta-nabilir-G-NE-PANELI-5V-2W-g-ne-plaka-Stabilize.jpg"
          ]
      },
      "crossLinkModule": {
          "crossLinkGroupList": [
              {
                  "isExpand": "Y",
                  "name": "Consumer Electronics",
                  "url": "//tr.aliexpress.com/store/group/Consumer-Electronics/1103187308_40000000980334.html"
              },
              {
                  "isExpand": "Y",
                  "name": "Phone & Accessories",
                  "url": "//tr.aliexpress.com/store/group/Phone-Accessories/1103187308_40000000976329.html"
              },
              {
                  "isExpand": "Y",
                  "name": "FOR DJI Osmo",
                  "url": "//tr.aliexpress.com/store/group/FOR-DJI-Osmo/1103187308_40000005284427.html"
              },
              {
                  "isExpand": "Y",
                  "name": "For Meta Quest 3",
                  "url": "//tr.aliexpress.com/store/group/For-Meta-Quest-3/1103187308_40000005326390.html"
              },
              {
                  "isExpand": "Y",
                  "name": "Others",
                  "url": "//tr.aliexpress.com/store/other-products/1103187308.html"
              }
          ]
      },
      "actionModule": {
          "categoryId": 52806,
          "comingSoon": false,
          "companyId": 2675928024,
          "rootCategoryId": 44,
          "itemWishedCount": 10600,
          "storeNum": 1103187308,
          "preSale": false
      },
      "priceModule": {
          "bigSellProduct": false,
          "discountPromotion": true,
          "discount": 10
      },
      "quantityModule": {
          "totalAvailQuantity": 687
      },
      "recommendModule": {
          "platformCount": 1027
      },
      "shippingModule": {
          "hbaFreeShipping": false
      },
      "sd_productPrices": 48.41,
      "sd_priceCurrency": "EUR",
      "sd_productPriceNew": 5.71
    };
  
    function manualParseAer(textWithJson, parsed, productId) {
      function search(obj, path, expectedType) {
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    if (key === path[0]) {
                        if (path.length === 1 && value !== null) {
                            switch (expectedType) {
                                case 'number':
                                    if (typeof value === 'number') {
                                        return value;
                                    }
                                    break;
                                case 'string':
                                    if (typeof value === 'string') {
                                        return value;
                                    }
                                    break;
                                case 'numberOrString':
                                    if (typeof value === 'number' || typeof value === 'string') {
                                        return value;
                                    }
                                    break;
                            }
                        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const result = search(value, path.slice(1), expectedType);
                            if (result !== null) {
                                return result;
                            }
                        }
                    } else if (Array.isArray(value)) {
                        for (const item of value) {
                            const result = search(item, path, expectedType);
                            if (result !== null) {
                                return result;
                            }
                        }
                    } else {
                        const result = search(value, path, expectedType);
                        if (result !== null) {
                            return result;
                        }
                    }
                }
            }
        }
        return null;
      }
    
      function handleApplicationJsonData(data) {
        const paths = [
            { key: "price", path: ["price", "minActivityAmount", "value"], expectedType: "number" },
            { key: "activity_price", path: ["price", "formattedActivityPrice"], expectedType: "string" },
            { key: "discount", path: ["price", "formattedDiscount"], expectedType: "string" },
            { key: "currency", path: ["price", "maxAmount", "currency"], expectedType: "string" },
            { key: "rating", path: ["rating", "middle"], expectedType: "numberOrString" },
            { key: "trade_count", path: ["tradeInfo", "tradeCount"], expectedType: "string" },
            { key: "reviews", path: ["reviews"], expectedType: "string" },
            { key: "trade_count_formatted", path: ["tradeInfo", "formatTradeCount"], expectedType: "string" },
            { key: "subscribers_count", path: ["subscribersCount"], expectedType: "string" },
            { key: "positive_reviews_percentage", path: ["positiveReviews", "percentages"], expectedType: "number" }
        ];
    
        paths.forEach(path => {
            const value = search(data, path.path, path.expectedType);
            if (value !== null) {
                switch (path.key) {
                    case "price":
                        if (typeof value === 'number') {
                            parsed.sd_productPriceNew = value;
                            parsed.sd_productPrices = value;
                        }
                        break;
                    case "currency":
                        if (typeof value === 'string') {
                          parsed.sd_priceCurrency = value;
                        }
                        break;
                    case "rating":
                        if (typeof value === 'number') {
                            parsed.titleModule.feedbackRating.averageStar = value;
                        } else if (typeof value === 'string') {
                            const ratingFloat = parseFloat(value);
                            if (!isNaN(ratingFloat)) {
                                parsed.titleModule.feedbackRating.averageStar = ratingFloat;
                            }
                        }
                        break;
                    case "trade_count":
                        if (typeof value === 'string') {
                            parsed.titleModule.tradeCount = value;
                            parsed.titleModule.feedbackRating.tradeCount = value;
                        }
                        break;
                    case "reviews":
                        if (typeof value === 'string') {
                            const reviewCount = parseInt(value, 10);
                            if (!isNaN(reviewCount)) {
                                parsed.titleModule.feedbackRating.totalValidNum = reviewCount;
                            }
                        }
                        break;
                    case "positive_reviews_percentage":
                        if (typeof value === 'number') {
                            parsed.storeModule.positiveRate = value;
                        } else if (typeof value === 'string') {
                            const positiveRateFloat = parseFloat(value);
                            if (!isNaN(positiveRateFloat)) {
                                parsed.storeModule.positiveRate = positiveRateFloat;
                            }
                        }
                        break;
                }
            }
        });
      }
    
      function extractAppJsonData(htmlString) {
        const scriptTagRegex = /<script id="__AER_DATA__" type="application\/json">([\s\S]*?)<\/script>/g;
    
        // Extract the script tags
        let match;
        while ((match = scriptTagRegex.exec(htmlString)) !== null) {
          const scriptContent = match[1];
          try {
            const data = JSON.parse(scriptContent);
            handleApplicationJsonData(data);
          } catch (error) {
            console.error('Failed to parse __AER_DATA__ JSON', error);
          }
        }
      }
    
      extractAppJsonData(textWithJson);
      parsed.parsedDataReceived = true;
      return parsed;
    }
  
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://your-extension-id') return; // Проверка источника
      const pageText = event.data;

      // Ваш код парсинга
      const parsedResult = parseHTML(pageText);

      // Отправляем результат обратно в content script
      event.source.postMessage(parsedResult, event.origin);
    });

    function parseHTML(html) {
      const parsed = JSON.parse(JSON.stringify(shutafFecher_1.parsedJsonDocumentExample));
      parsed.sd_priceTodayDate = new Date().toISOString().split("T")[0];
      parsed.sd_priceCurrency = undefined;
      manualParseAer(html, parsed, 42);
      
      return parsed; // Пример результата
    }
  </script>
</head>
<body>
</body>
</html>
