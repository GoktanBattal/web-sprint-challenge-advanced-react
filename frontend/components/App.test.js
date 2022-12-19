import React from 'react'
import AppFunctional from './AppFunctional'
import { render, fireEvent, screen } from '@testing-library/react'

test("find & press Left button", () => {
  render(<AppFunctional/>)
  const coordinates = screen.getByTestId("coordinates")
  const btnLeft = screen.getByTestId("left")
  fireEvent.click(btnLeft)
  expect(coordinates.textContent).toBe("Coordinates (1, 2)")
});

test("find & press Right button", () => {
  render(<AppFunctional/>)
  const coordinates = screen.getByTestId("coordinates")
  const btnRight = screen.getByTestId("right")
  fireEvent.click(btnRight)
  expect(coordinates.textContent).toBe("Coordinates (3, 2)")
});

test("find & press Up button", () => {
  render(<AppFunctional/>)
  const coordinates = screen.getByTestId("coordinates")
  const btnUp = screen.getByTestId("up")
  fireEvent.click(btnUp)
  expect(coordinates.textContent).toBe("Coordinates (2, 1)")
});

test("find & press Down button", () => {
  render(<AppFunctional/>)
  const coordinates = screen.getByTestId("coordinates")
  const btnDown = screen.getByTestId("down")
  fireEvent.click(btnDown)
  expect(coordinates.textContent).toBe("Coordinates (2, 3)")
});

test("find & press Reset button", () => {
  render(<AppFunctional/>)
  const coordinates = screen.getByTestId("coordinates")
  const btnReset = screen.getByTestId("reset")
  fireEvent.click(btnReset)
  expect(coordinates.textContent).toBe("Coordinates (2, 2)")
});

test("Email input value changes", () => {
  render(<AppFunctional/>)
  const emailInput = screen.getByTestId("email")
  fireEvent.change(emailInput,{
    target: {
      value: "email input value changes"
    }
  })
  expect(emailInput.value).toBe("email input value changes")
});