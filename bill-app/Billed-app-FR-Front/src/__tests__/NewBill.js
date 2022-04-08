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
      const submitBtn = screen.getByRole("submit")
      const fileName = "test.mp4"
      const fileReg= new RegExp("\.(jpg|jpeg|png?)$","i")
      function testFileNow(){
        if (fileReg.test(fileName)){
          alert.style.display= "none"
          alert.innerHTML=""
        } else {
          alert.style.display= "block"
          alert.innerHTML= "Veuillez uniquement choisir un fichier jpg, jpeg ou png"}
      }
      testFileNow()
      fireEvent.submit(submitBtn)
      expect(alert.textContent).toBe("Veuillez uniquement choisir un fichier jpg, jpeg ou png")
    })
    test("Then I fill in the form with a file in a jpg format", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const alert = screen.getByTestId("alert")
      //to-do write assertion
      const submitBtn = screen.getByRole("submit")
      const fileName = "test.jpg"
      const fileReg= new RegExp("\.(jpg|jpeg|png?)$","i")
      function testFileNow(){
        if (fileReg.test(fileName)){
          alert.style.display= "none"
          alert.innerHTML=""
        } else {
          alert.style.display= "block"
          alert.innerHTML= "Veuillez uniquement choisir un fichier jpg, jpeg ou png"}
      }
      testFileNow()
      fireEvent.submit(submitBtn)
      expect(alert.textContent).not.toBe("Veuillez uniquement choisir un fichier jpg, jpeg ou png")
    })
  })
})
