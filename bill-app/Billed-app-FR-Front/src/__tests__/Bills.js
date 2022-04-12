/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import {ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(document.body).toContainElement(windowIcon);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      const antiChronoBills = (a, b) => (a.date < b.date ? 1 : -1);
      const billsSorted = [...bills].sort(antiChronoBills);
      document.body.innerHTML = BillsUI({ data: billsSorted });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    describe("When I click on the New Bill button", () => {
      test("Then it should render New Bill page", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI(bills[0])
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const billdashboard = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
  
        const handleClickNewBill = jest.fn(billdashboard.handleClickNewBill)
        const btn = screen.getByTestId('btn-new-bill')
        btn.addEventListener('click', handleClickNewBill)
        fireEvent.click(btn)
        expect(handleClickNewBill).toHaveBeenCalled()
        const form = screen.getByTestId('form-new-bill')
        expect(form).toBeTruthy()
        
      })
    });
    describe("When I click on the Icon Eye button", () => {
      test("Then a modal should open'", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI(bills[0])
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const billdashboard = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        
        const icon = document.createElement('button')
        icon.setAttribute('data-testid','icon-eye')
        icon.setAttribute('data-bill-url',"http://localhost:5678/public/fd2b6f20f86a470cdc10b54ac35253fa")
        document.body.appendChild(icon)

        const handleClickIconEye = jest.fn(billdashboard.handleClickIconEye)
        const iconEye = []
        iconEye.push(icon)
        iconEye.forEach(e => {
        e.addEventListener('click', () => this.handleClickIconEye(e))
        })
        fireEvent.click(icon)
        expect(handleClickIconEye).toHaveBeenCalled()
        const modal = screen.getByText('Justificatif')
        expect(modal).toBeTruthy()
        
      })
    });

  });
});


