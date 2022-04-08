/**
 * @jest-environment jsdom
 */
import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import {handleSubmit} from "../containers/NewBill.js"
import bills from "../fixtures/bills.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I fill in the form with a file in mp4 format", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const alert = screen.getByTestId("alert")
      //to-do write assertion
      const inputType = screen.getByLabelText("Type de dépense");
      const inputName = screen.getByLabelText("Nom de la dépense");
      const inputDate = screen.getByLabelText("Date");
      const inputAmount = screen.getByTestId("amount");
      const inputVat = screen.getByLabelText("TVA");
      const inputPct = screen.getByLabelText("%");
      const inputFile = screen.getByLabelText("Justificatif");
      const submitBtn = screen.getByRole("submit")
      const file = new File(['(a)'], 'test.rien', { type: 'image/mp4' })
      fireEvent.change(inputType, { target: {value :"Transports"}})
      fireEvent.change(inputName, {traget: { value: "Test"}})
      fireEvent.change(inputDate, {target: {value: "2022-04-03"}})
      fireEvent.change(inputAmount, {target: {value: "120"}})
      fireEvent.change(inputVat, {target: {value: "20"}})
      fireEvent.change(inputPct, {target: {value: "20"}})
      fireEvent.change(inputFile, {target: {files: [file]}})
      const fileReg= new RegExp("\.(jpg|jpeg|png?)$","i")
      function testFileNow(){
        if (fileReg.test(this.fileName)){
          alert.style.display= "none"
          this.updateBill(bill)
          this.onNavigate(ROUTES_PATH['Bills']) 
        } else {
          alert.style.display= "block"
          alert.innerHTML= "Veuillez uniquement choisir un fichier jpg, jpeg ou png"}
      }
      testFileNow()
      fireEvent.submit(submitBtn)
      expect(alert.textContent).toBe("Veuillez uniquement choisir un fichier jpg, jpeg ou png")
    
    })
  })
})
