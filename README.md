# Checkout TS

Checkout API built with Typescript, applying promotional discounts

> **Note**:
> Based on [antfu TS template](https://github.com/antfu/starter-ts)

## Prerequisites

Things you will need:

- [Bun](https://bun.sh/)
  - or use [tsx](https://tsx.is)

### Getting Started

Clone the project

```bash
git clone git@github.com:Fecony/checkout-ts.git
```

Go to the project directory

```bash
cd checkout-ts
```

Install dependencies

```bash
bun install
```

### Running code

Run `src/index.ts` file to see few test case output

```bash
bun run src/index.ts
```

### Running Tests

Use `bun run test` or `bun test` command to run tests.

## Overview

This document provides an overview of the architecture for a checkout system that supports promotional rules. The system is designed with flexibility, extensibility, and adherence to SOLID principles. The primary components of the system include products, the shopping cart, promotional rules, and the promotion engine.

### Components

#### Product

The Product class represents an individual item that can be added to the cart. It includes properties such as code, name, and price, with validation to ensure prices are non-negative.

#### Cart

The Cart class is responsible for managing the items that a customer scans. It maintains a collection of products and their quantities and provides methods to add, remove, and update products. It also calculates the subtotal of the items in the cart.

#### PromotionalRule

This interface defines the contract for implementing different types of promotional rules. It has two methods:

`isApplicable(cart: Cart): boolean`: Checks if the rule can be applied to the current cart.
`apply(cart: Cart): number`: Calculates the discount amount based on the cart's contents.

#### BulkPriceReductionRule

This class provides a discount if a certain quantity of a specific product is purchased.

#### PercentageDiscountRule

This class provides a percentage discount if the total value of the cart exceeds a specified threshold.

#### BuyOneGetOneRule

This class provides a free product for every product of the same type purchased.

#### PromotionEngine

This class manages a list of promotional rules and applies them to a given cart. It calculates the total discount by iterating through all the applicable rules.

#### Checkout

The Checkout class ties everything together. It uses the Cart to manage items and the `PromotionEngine` to apply discounts. It provides methods to scan items into the cart and calculate the total price after discounts.

### Design

#### Pros

##### Extensibility

The system’s design allows for easy extension and addition of new features, such as different types of promotions, without requiring significant changes to existing code. This makes it adaptable to new business requirements.

##### Flexibility

The design accommodates various types of promotional rules without requiring changes to core components. This flexibility allows for the dynamic addition and adjustment of promotional strategies to meet evolving business needs.

##### Maintainability

The clear separation of responsibilities among different components simplifies the maintenance process. If a bug or issue arises, it's easier to pinpoint and address it due to the focused functionality of each class.

#### Cons

##### Increased Complexity

The separation of concerns across multiple classes and interfaces adds complexity to the system. This can make the architecture harder to understand for new developers and can complicate the process of onboarding team members.

##### Performance Overhead

Applying multiple promotional rules through `PromotionEngine` involves iterating over each rule and calculating discounts. This approach may introduce performance overhead, especially with a large number of rules or a high volume of transactions.

#### List of trade-offs

##### No Database Integration

> The system does not include a database for storing products or user data. All data is managed in-memory using JavaScript objects and arrays. (Even though it's not required in this case)

- **Justification**:
  - The primary focus was on creating a straightforward in-memory implementation for quick development and testing. This approach minimizes initial setup and avoids the complexities associated with database management.
  - For a prototype or small-scale system, in-memory data management can be faster and easier to work with. Adding a database introduces overhead and complexity that may not be necessary for initial requirements.

##### Sequential Rule Processing

> Promotional rules are applied sequentially in the `PromotionEngine`, meaning each rule is evaluated one after the other.

- **Justification**:
  - This design keeps the process simple and ensures that each promotional rule is independently managed. It aligns with the modular design approach, where each rule implements the PromotionalRule interface.

##### Limited Extensibility for Complex Rules

> The current design allows for adding new promotional rules but may require significant changes for more complex or dynamic promotional strategies.

- **Justification**:
  - The system was designed to handle a basic set of promotional rules. While extensibility is supported, complex rules that require external data or interactions might necessitate more sophisticated designs, which were beyond the initial scope.

##### Decoupling and DI

> The system uses direct instantiation of dependencies (e.g., `PromotionEngine` in Checkout) rather than dependency injection.

- **Justification**:
  - Direct instantiation simplifies the code by avoiding the complexity of setting up a dependency injection framework. This approach makes it easier to understand and manage dependencies in smaller projects. Hovewer direct instantiation creates tight coupling between components. This can make testing more difficult, as you need to manually manage dependencies and might require more setup for unit tests.

##### Testing Coverage and Complexity

> The system’s design focuses on individual components and rules, but comprehensive testing strategies (e.g., integration tests) are not addressed.

- **Justification**:
  - The current design supports unit testing of individual components, which is essential for ensuring the correctness of each part of the system. Testing components in isolation helps to identify and fix issues more effectively, improving the reliability of the codebase.
