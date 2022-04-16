/**
 * @jest-environment jsdom
 */

 import {screen} from "@testing-library/dom";
 import "@testing-library/jest-dom";
 import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";
import NewBillUI from "../views/NewBillUI.js"


//Test intégration Post New Bill

beforeEach(() => {
  document.body.innerHTML = NewBillUI()
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  jest.clearAllMocks();
})

describe("Given I am connected as an employee", () =>{
  describe("When I create a new bill", () =>{
  test("posts bill with mock API POST", async () => {
   const spyStore = jest.spyOn(store, "bills")
   
   const newBill = {
    "id": "47qAXb6fIm2zOKkLzMro",
    "vat": "80",
    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
    "status": "pending",
    "type": "Hôtel et logement",
    "commentary": "séminaire billed",
    "name": "post Bill",
    "fileName": "preview-facture-free-201801-pdf-1.jpg",
    "date": "2004-04-04",
    "amount": 40,
    "commentAdmin": "ok",
    "email": "a@a",
    "pct": 20
   }

   const listBills = await store.bills().list()
   let billsLength = listBills.length + 1;
   const result = await store.bills().create(newBill)

   expect(spyStore).toHaveBeenCalled()
   expect(result.length).toEqual(billsLength)
  })

  describe("When I create a new bill with a error", ()=>{
    test("posts bill with mock API POST but fail with 404 error message", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          create: () => {
            return Promise.reject(new Error("Erreur 404"));
          }
        }
      })

      const html = ROUTES({ pathname: ROUTES_PATH['Bills'], error: "Erreur 404"})
      document.body.innerHTML = html

      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    })
    test("posts bill with mock API POST but fail with 500 error message", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          create: () => {
            return Promise.reject(new Error("Erreur 500"));
          }
        }
      })

      const html = ROUTES({ pathname: ROUTES_PATH['Bills'], error: "Erreur 500"})
      document.body.innerHTML = html

      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    })
  })
  })
})