async function manualParseInterceptedJson(textWithJson, parsed, inProductId) {
  function div2BackSlashesBeforeQuote(input) {
    let output = '';
    let i = 0;
    const length = input.length;

    while (i < length) {
        if (input[i] !== '\\') {
            output += input[i];
            i++;
        } else {
            let count = 0;
            while (i < length && input[i] === '\\') {
                count++;
                i++;
            }
            if (i < length && input[i] === '"') {
                if (count % 2 === 0) {
                    const halfCount = count / 2;
                    output += '\\'.repeat(halfCount);
                    output += '"';
                    i++;
                } else {
                    output += '\\'.repeat(count);
                    output += '"';
                    i++;
                }
            } else {
                output += '\\'.repeat(count);
            }
        }
    }

    return output;
  }

  function parsePriceString(s) {
    s = s.replace(/,/g, '.');
    s = s.replace(/[^\d\.]+/g, '').trim();

    const f = parseFloat(s);
    if (isNaN(f)) {
        return null;
    }
    return f;
  }

  try {
    let jsonData = textWithJson.trim();
    const idx = jsonData.indexOf('(');
    if (idx !== -1) {
        jsonData = jsonData.slice(idx + 1);
    }
    jsonData = jsonData.slice(0, -1);
    jsonData = div2BackSlashesBeforeQuote(jsonData);

    let result;
    try {
        result = JSON.parse(jsonData);
    } catch (err) {
        throw new Error(`error parsing JSON: ${err}`);
    }

    let productId = inProductId;

    const dataMap = result.data;
    if (!dataMap) {
        throw new Error("no 'data' field found in JSON");
    }

    const resultMap = dataMap.result;
    if (!resultMap) {
        throw new Error("no 'result' field found in 'data'");
    }

    const priceMap = resultMap.PRICE;
    if (priceMap) {
        const targetSkuPriceInfo = priceMap.targetSkuPriceInfo;
        if (targetSkuPriceInfo) {
            const originalPrice = targetSkuPriceInfo.originalPrice;
            if (originalPrice) {
                const formatedAmount = originalPrice.formatedAmount;
                if (formatedAmount) {
                    parsed.sd_productPrices = parsePriceString(formatedAmount);
                }
                const currency = originalPrice.currency;
                if (currency) {
                  parsed.sd_priceCurrency = currency;
                }
            }

            const salePriceString = targetSkuPriceInfo.salePriceString;
            if (salePriceString) {
                parsed.sd_productPriceNew = parsePriceString(salePriceString);
                parsed.sd_productPrices = parsed.sd_productPriceNew;
            }
        }

        const parsedProductId = priceMap.productId;
        productId = productId || parsedProductId.toString();
    }

    const pcRatingMap = resultMap.PC_RATING;
    if (pcRatingMap) {
        const ratingStr = pcRatingMap.rating;
        if (ratingStr) {
            const ratingFloat = parseFloat(ratingStr);
            if (!isNaN(ratingFloat)) {
              parsed.titleModule.feedbackRating.averageStar = parseFloat(ratingStr);
            }
        }

        const totalValidNumFloat = pcRatingMap.totalValidNum;
        if (totalValidNumFloat) {
          parsed.titleModule.feedbackRating.totalValidNum = totalValidNumFloat;
        }

        const otherText = pcRatingMap.otherText;
        if (otherText) {
            parsed.titleModule.tradeCount = otherText.split(' ')[0];
            parsed.titleModule.feedbackRating.tradeCount = parsed.titleModule.tradeCount;
        }
    }

    const shopCardPCMap = resultMap.SHOP_CARD_PC;
    if (shopCardPCMap) {
        const sellerPositiveRateStr = shopCardPCMap.sellerPositiveRate;
        if (sellerPositiveRateStr) {
            const rateStr = sellerPositiveRateStr.replace('%', '').trim();
            const rateFloat = parseFloat(rateStr);
            if (!isNaN(rateFloat)) {
              parsed.storeModule.positiveRate = parseFloat(rateStr);
            }
        }
    }

    parsed.parsedDataReceived = true;
    await shutafFecher_1.parsedJsonDocumentMap.set(productId, parsed);
  }
  catch(error) {
    throw new Error(`Error parsing JSON: ${error.message}`);
  }
}

async function manualParseAer(textWithJson, parsed, productId) {
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
  await shutafFecher_1.parsedJsonDocumentMap.set(productId, parsed);
}

async function remoteParseByParseUrl(parseUrl, theText, parsed, inProductId) {
  fetch(parseUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain'
    },
    body: theText
  })
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(async data => {
      logger_1.debug("Remote parsed data:");
      logger_1.debug(data);
      if (!data) {
        throw new Error('Data is null');
      }
      const productId = inProductId || data.product_id;
      parsed.sd_productPriceNew = data.price;
      parsed.sd_productPrices = data.price;
      parsed.sd_priceCurrency = data.currency;
      parsed.titleModule.feedbackRating.averageStar = data.average_star;
      parsed.titleModule.feedbackRating.totalValidNum = data.total_valid_num;
      if (!data.total_valid_num && data.reviews) {
        parsed.titleModule.feedbackRating.totalValidNum = data.reviews;
      }
      if (data.trade_count) {
        parsed.titleModule.tradeCount = data.trade_count;
        parsed.titleModule.feedbackRating.tradeCount = data.trade_count;
      }
      if (data.positive_rate) {
        parsed.storeModule.positiveRate = data.positive_rate;
      }
      parsed.parsedDataReceived = true;
      await shutafFecher_1.parsedJsonDocumentMap.set(productId, parsed);
  })
  .catch(error => {
      console.error('Error during parsing intercepted json', error);
  });
}

function getProductIdFromUrl(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const dataParam = params.get('data');
  const decodedData = decodeURIComponent(dataParam);
  const dataObj = JSON.parse(decodedData);
  return dataObj.productId;
}
