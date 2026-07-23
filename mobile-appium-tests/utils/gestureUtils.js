const logger = require('./logger');

/**
 * Enterprise Mobile Gesture Utility using W3C Actions API for Appium 2.x
 */
class GestureUtils {
  static async tap(driver, x = 500, y = 1000) {
    logger.info(`Executing Tap gesture at coordinates (${x}, ${y})`);
    if (!driver || !driver.performActions) return true;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  static async doubleTap(driver, x = 500, y = 1000) {
    logger.info(`Executing Double Tap gesture at (${x}, ${y})`);
    if (!driver || !driver.performActions) return true;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 50 },
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 50 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  static async longPress(driver, x = 500, y = 1000, durationMs = 1500) {
    logger.info(`Executing Long Press gesture at (${x}, ${y}) for ${durationMs}ms`);
    if (!driver || !driver.performActions) return true;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: durationMs },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  static async swipe(driver, startX = 500, startY = 1500, endX = 500, endY = 500, durationMs = 600) {
    logger.info(`Executing Swipe gesture from (${startX}, ${startY}) to (${endX}, ${endY})`);
    if (!driver || !driver.performActions) return true;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: durationMs, x: endX, y: endY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  static async scroll(driver, direction = 'down') {
    logger.info(`Executing Scroll gesture: ${direction}`);
    if (direction === 'down') {
      await GestureUtils.swipe(driver, 500, 1500, 500, 500);
    } else if (direction === 'up') {
      await GestureUtils.swipe(driver, 500, 500, 500, 1500);
    } else if (direction === 'right') {
      await GestureUtils.swipe(driver, 200, 800, 900, 800);
    } else if (direction === 'left') {
      await GestureUtils.swipe(driver, 900, 800, 200, 800);
    }
  }

  static async dragAndDrop(driver, startX, startY, endX, endY) {
    logger.info(`Executing Drag & Drop from (${startX}, ${startY}) to (${endX}, ${endY})`);
    await GestureUtils.swipe(driver, startX, startY, endX, endY, 1000);
  }

  static async pinch(driver, centerX = 500, centerY = 1000) {
    logger.info(`Executing Pinch gesture centered at (${centerX}, ${centerY})`);
    if (!driver || !driver.performActions) return true;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 200, y: centerY - 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 400, x: centerX - 50, y: centerY - 50 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 200, y: centerY + 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 400, x: centerX + 50, y: centerY + 50 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  static async zoom(driver, centerX = 500, centerY = 1000) {
    logger.info(`Executing Zoom gesture centered at (${centerX}, ${centerY})`);
    if (!driver || !driver.performActions) return true;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 50, y: centerY - 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 400, x: centerX - 250, y: centerY - 250 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 50, y: centerY + 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 400, x: centerX + 250, y: centerY + 250 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}

module.exports = GestureUtils;
