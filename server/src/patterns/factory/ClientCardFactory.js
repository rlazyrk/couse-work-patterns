import { CardType } from "@prisma/client";

class ClientCardFactory {
  static createCard(cardType, userId) {
    const cardConfig = this.getCardConfig(cardType);

    return {
      userId,
      type: cardType,
      bonusPoints: cardConfig.initialBonusPoints,
      deliveryDiscountPercent: cardConfig.deliveryDiscountPercent,
    };
  }

  static getCardConfig(cardType) {
    const configs = {
      [CardType.STANDARD]: {
        initialBonusPoints: 0,
        deliveryDiscountPercent: 0,
      },
      [CardType.BONUS]: {
        initialBonusPoints: 0,
        deliveryDiscountPercent: 10,
      },
      [CardType.GOLD]: {
        initialBonusPoints: 0,
        deliveryDiscountPercent: 100,
      },
      [CardType.SOCIAL]: {
        initialBonusPoints: 0,
        deliveryDiscountPercent: 50,
      },
    };

    return configs[cardType] || configs[CardType.STANDARD];
  }

  static canUpgrade(currentType, newType) {
    const hierarchy = {
      [CardType.STANDARD]: 1,
      [CardType.BONUS]: 2,
      [CardType.SOCIAL]: 2,
      [CardType.GOLD]: 3,
    };

    return hierarchy[newType] > hierarchy[currentType];
  }
}

export default ClientCardFactory;
