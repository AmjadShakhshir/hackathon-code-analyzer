// Test JavaScript file for complexity analysis
import { helper } from './utils.js';

export function complexFunction(data) {
  let result = 0;
  
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      if (item.type === 'urgent') {
        if (item.value > 100) {
          result += item.value * 2;
        } else if (item.value > 50) {
          result += item.value * 1.5;
        } else {
          result += item.value;
        }
      } else if (item.type === 'normal') {
        try {
          result += helper(item.value);
        } catch (error) {
          result += 0;
        }
      } else {
        result += 1;
      }
    }
  }
  
  return result > 1000 ? 1000 : result;
}

export const simpleFunction = (x, y) => x + y;
