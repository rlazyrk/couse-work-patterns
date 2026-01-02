class DeliveryDiscountStrategy {
  calculateDiscount(originalPrice, cardType) {
    throw new Error("Method must be implemented");
  }
}

class StandardCardStrategy extends DeliveryDiscountStrategy {
  calculateDiscount(originalPrice, cardType) {
    return originalPrice; // Без знижки
  }
}

class BonusCardStrategy extends DeliveryDiscountStrategy {
  calculateDiscount(originalPrice, cardType) {
    // 10% 
    return originalPrice * 0.9;
  }
}

class GoldCardStrategy extends DeliveryDiscountStrategy {
  calculateDiscount(originalPrice, cardType) {
    // 100% 
    return 0;
  }
}

class SocialCardStrategy extends DeliveryDiscountStrategy {
  calculateDiscount(originalPrice, cardType) {
    // 50% 
    return originalPrice * 0.5;
  }
}

class DeliveryDiscountContext {
  constructor() {
    this.strategies = {
      STANDARD: new StandardCardStrategy(),
      BONUS: new BonusCardStrategy(),
      GOLD: new GoldCardStrategy(),
      SOCIAL: new SocialCardStrategy(),
    };
  }

  calculate(originalPrice, cardType, customDiscountPercent = null) {
    if (customDiscountPercent !== null) {
      return originalPrice * (1 - customDiscountPercent / 100);
    }

    const strategy = this.strategies[cardType] || this.strategies.STANDARD;
    return strategy.calculateDiscount(originalPrice, cardType);
  }
}

export {
  DeliveryDiscountContext,
  DeliveryDiscountStrategy,
  StandardCardStrategy,
  BonusCardStrategy,
  GoldCardStrategy,
  SocialCardStrategy,
};
