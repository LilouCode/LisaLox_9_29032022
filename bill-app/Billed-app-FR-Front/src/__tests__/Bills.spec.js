/**
 * @jest-environment jsdom
 */

 import { fireEvent, screen, waitFor } from "@testing-library/dom";
 import "@testing-library/jest-dom";
 import BillsUI from "../views/BillsUI.js";
 import { bills } from "../fixtures/bills.js";
 import {ROUTES, ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store";
 import Bills from "../containers/Bills.js";
 import router from "../app/Router.js";
 
 jest.mock("../app/store", () => mockStore)
//Test intégration Get Bills
describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to Bills", () => {
      test("fetches bills from mock API GET", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        await waitFor(() => screen.getByText("Mes notes de frais"))
        const contentName  = await screen.getByText("encore")
        expect(contentName).toBeTruthy()
        const contentDate  = await screen.getByText("2003 03 03")
        expect(contentDate).toBeTruthy()
        expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
      })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
  
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  
    })
  })