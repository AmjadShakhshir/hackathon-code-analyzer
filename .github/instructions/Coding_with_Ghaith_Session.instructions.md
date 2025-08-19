
# Coding with Ghaith (Session 1)

## Introduction

This guidebook is based on a training session led by **Ghaith Tarawneh**, focusing on enhancing software engineering skills through code refactoring and good programming practices in Python. The session emphasizes writing maintainable, readable, and understandable code by applying fundamental software engineering principles.

---

## Mindmap

A textual mindmap to visualize the key concepts and their relationships:

- **Elevating Coding Skills**
  - **Readable Code**
    - Naming
    - Visual Clutter
  - **Programming Styles**
    - Procedural
    - Declarative
  - **Decomposition**
    - Vertical Ideas
    - Horizontal Ideas
    - Recompositing
  - **Function Principles**
    - Single Responsibility Principle
    - Generality & Reusability
  - **Code Structure**
    - Indentation Levels
    - Scope Hiding
    - Modules
  - **Python Idioms**
    - List Comprehensions
    - Predicate Functions
  - **Anti-patterns**
    - Accumulator Anti-pattern
    - Redundant Boolean Returns
    - Excessive Indentation
    - Parameterizing Functions to Modify Behavior
  - **Common Mistakes**
    - Deeply Nested Code
    - Poor Naming Conventions

---

## Main Themes

### Importance of Readable Code

- Code is read more often than executed, making readability crucial for maintainability.
- **Example**: `calculate_age` is more readable than `calc_age` or `age_calc`.

### Procedural vs. Declarative Programming

- **Procedural**: Step-by-step instructions; can lead to nested code.
  - *Example*: Using a `for` loop with `if` statements.
- **Declarative**: Focus on the *what* over the *how*.
  - *Example*: List comprehensions for filtering a list.

### Decomposition and Vertical Ideas

- Break problems into smaller parts.
  - *Example*: `calculate_median_years()` for median logic.
- Extract logical ideas into functions.
  - *Example*: `parse_date()` for date parsing.

### Single Responsibility Principle

- Functions should do one thing well.
  - *Example*: `read_json_file()` should only read, not parse.

### Function Generality and Reusability

- General functions are easier to reuse and maintain.
  - *Example*: `calculate_year_difference()` is generic and adaptable.

### Indentation Levels

- Excessive indentation indicates poor structure.
  - *Example*: Refactor nested logic into separate functions.

### Importance of Naming

- Use clear, descriptive names.
  - *Example*: `filter_employees_by_age()` > `filter_age()`.

### Scope Hiding and Modules

- Use modules to group related functions and manage complexity.
  - *Example*: `employee_utils` module.

### List Comprehensions (Idiomatic Python)

- Use for concise, declarative iteration and filtering.
  - *Example*: `[e for e in employees if e.age > 30]`.

### Avoiding Anti-Patterns

- Avoid:
  - Accumulator anti-pattern
  - Redundant Boolean returns
  - Parameterizing functions to alter behavior

### Common Coding Mistakes

#### Deeply Nested Code

- Makes code harder to read/maintain.
  - *Solution*: Extract nested logic into functions.

#### Accumulator Anti-Pattern

- Use comprehensions instead of appending in loops.
  - *Example*: `[item for item in items]`.

#### Redundant Boolean Returns

- Replace:
  ```python
  if condition:
      return True
  else:
      return False
  ```
  with:
  ```python
  return condition
  ```

#### Poor Naming Conventions

- Use descriptive names.
  - *Example*: `calculate_average_age` > `calc_avg`.

#### Excessive Indentation

- More than two levels → refactor!

#### Parameterizing Functions to Modify Behavior

- Avoid making one function do too much through parameters.
  - Instead, create separate functions for different tasks.

---

## Key Takeaways and Actionable Advice

- ✅ Prioritize **readability** and **maintainability**.
- 🧠 Break down problems into **vertical ideas**.
- 📌 Stick to the **Single Responsibility Principle**.
- 🧾 Use **descriptive names** for functions and variables.
- 🔽 Keep **indentation levels** low.
- 🐍 Embrace **idiomatic Python** (e.g., list comprehensions).
- 🚫 Watch out for and refactor **anti-patterns**.
- 🔍 Write code that communicates the **what**, not just the how.
- 📚 Keep learning from mentors, codebases, and resources.
- 🧘‍♂️ Practice intentionally—**muscle memory** builds over time.
- 🎯 Start small: extract **one vertical idea** today.

---

## Glossary of Key Terms

- **Procedural Code**: Step-by-step instructions, focusing on operation sequence.
- **Declarative Code**: Describes the desired result, not the process.
- **Anti-pattern**: Common but ineffective or harmful coding practices.
- **Vertical Idea**: A logical, self-contained piece of functionality.
- **Horizontal Idea**: Sequential execution, characteristic of procedural flow.
- **Decomposition**: Breaking problems into smaller components.
- **Recompositing**: Reassembling decomposed components into a solution.
- **Function**: A reusable block of code performing a single task.
- **Module**: A file containing reusable Python code.
- **Single Responsibility Principle**: One function/module = one responsibility.
- **List Comprehension**: A compact way to construct lists in Python.
- **Idiomatic Python**: Conventional and preferred Python coding style.
- **Non-idiomatic**: Code not aligning with standard conventions.
- **Scope Hiding**: Keeping variables/functions within their relevant scope.
- **Predicate Function**: Returns a boolean (e.g., `is_valid()`).
- **Visual Clutter**: Code that's hard to scan or parse quickly.
- **Refactoring**: Restructuring code without changing its behavior.
- **Accumulator Anti-pattern**: Building lists with loops instead of comprehensions.
- **Dependency Tree**: Shows how components depend on each other.
- **Conscious Practice**: Intentional and mindful skill improvement.

---
