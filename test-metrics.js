// Simple test file for metrics charts
function simpleFunction() {
  return "hello world";
}

const complexFunction = (data, options) => {
  if (!data || !data.length) {
    return null;
  }
  
  let result = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    if (options.filter) {
      if (item.type === 'important') {
        if (item.value > 100) {
          result.push(item.value * 2);
        } else if (item.value > 50) {
          result.push(item.value * 1.5);
        } else {
          try {
            result.push(processItem(item));
          } catch (error) {
            console.error(error);
            result.push(0);
          }
        }
      } else if (item.type === 'normal') {
        result.push(item.value);
      }
    } else {
      result.push(item.value || 0);
    }
  }
  
  return result.length > 0 ? result : null;
};

function processItem(item) {
  return item.value + 10;
}
