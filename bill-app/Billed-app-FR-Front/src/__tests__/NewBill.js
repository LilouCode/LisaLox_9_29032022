/**
 * @jest-environment jsdom
 */
import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import "@testing-library/jest-dom";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from '../constants/routes';
import userEvent from "@testing-library/user-event";

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

beforeEach(() => {
  document.body.innerHTML= NewBillUI()
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill page", () => {
    test("Then I should see new bill form", () => {
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    })
  })

  describe("When I submit new bill form", ()=>{
    test("Then I should be redirected to Bills page", () =>{
      const newBillCont = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const handleClickSubmit= jest.fn(newBillCont.handleSubmit)
      const newBillFormBox = screen.getByTestId('form-new-bill')
      newBillFormBox.addEventListener('submit', handleClickSubmit)
      fireEvent.submit(newBillFormBox)
      expect(handleClickSubmit).toHaveBeenCalled()
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
  describe("When I am on NewBill Page and I upload a file with a MP4 format", () => {
    test("The input file should stay empty", async () => {
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
  })
  describe("When I upload a file in the good format", ()=>{
    test("Then it should be added to the input field", async ()=>{
    
      const newBill = new NewBill ({
        document, onNavigate, store: null, localStorage: window.localStorage,
      })
      
      const input = screen.getByTestId('file')
      const file = new File(["facture"], "facture.png", {type: "image/png"})

      userEvent.upload(input, file)
      expect(input.files[0]).toBe(file)
      expect(input.files.item(0)).toStrictEqual(file);
      expect(input.files).toHaveLength(1);

      const sendBtn = screen.getByRole("submit");
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
      sendBtn.addEventListener("click", handleChangeFile);
      fireEvent.click(sendBtn);
      expect(handleChangeFile).toHaveBeenCalled();      
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I upload a file on the file input", () => {
    test("Then the function handleChangeFile should be called", () =>{
      const fileName = "preview-facture-free-201801-pdf-1.jpg"
      const fileReg= new RegExp("\.(jpg|jpeg|png?)$","i")
      const errorFile= document.createElement('span')
      if (fileReg.test(fileName)){
        errorFile.style.display= "none"
        
      } else{
        document.querySelector(`input[data-testid="file"]`).value= null
        console.log(file)
        errorFile.style.display= "block"
        errorFile.style.color = "red"
        errorFile.innerHTML= "Veuillez uniquement choisir un fichier jpg, jpeg ou png"
      }
      expect(errorFile.innerHTML).toBe("")
    })
  })
})

/////////////////////////////

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I upload a file with a MP4 format", () => {
    test("The input file should stay empty", async () => {
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
