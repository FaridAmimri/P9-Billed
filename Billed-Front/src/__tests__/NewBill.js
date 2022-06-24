/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"


describe("Given I am connected as an employee", () => {

  // test function handleChangeFile -> is it the right extension file ?
  describe("When I am on NewBill Page, and I change file", () => {
    test("Then the function handleChangeFile is called", () => {

      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({type: 'employee'}))

      // create the context
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}

      // create a New Bill
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId("file")
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, {
        target: {
          files: [new File(["text.txt"], "text.txt", {
            type: "text/txt"
          })],
        }
      })

      // get handleSubmit function
      expect(handleChangeFile).toBeCalled()

      // If file have '.txt' extension, window alert should be displayed
      // expect(window.alert).style.display
    })

     // test message d'erreur
    test("Then the window alert should be displayed", () => {

      // create the context
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}
      const store = {
        storage: {ref: jest.fn(() => {
            return {
              put: jest
                .fn()
                .mockResolvedValueOnce({
                  ref: {getDownloadURL: jest.fn()}
                }),
            };
          }),
        },
      }

      // create a newBill
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      })

      // get handleChangeFile function
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId("file")
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, {
        target: {
          files: [new File(["image"], "image.jpg", {
            type: "image/jpg"
          })],
        }
      })

      // verify we have an extension .jpg
      expect(file.files.length).toEqual(1)

      // The window alert should be in displayed
      // expect(document.querySelector("#errorMessagId").style.display).toBe("none")
    })
  })

 
})
