/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import "@testing-library/jest-dom"


describe("Given I am connected as an employee", () => {

  Object.defineProperty(window, 'localStorage', {value: localStorageMock})
  window.localStorage.setItem('user', JSON.stringify({type: 'employee'}))

  // test function handleChangeFile -> is it the right extension file ?
  describe("When I am on NewBill Page, and I change file", () => {
    test("Then the function handleChangeFile is called", () => {

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

      // If file have '.txt' extension, the errorMessage should be displayed "block"
      expect(document.querySelector("#errorMessagId").style.display).toBe("block")
    })

     // test message d'erreur
    // test("Then the error message should not be displayed", () => {

    //   // create the context
    //   document.body.innerHTML = NewBillUI()
    //   const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}

    //   const store = {
    //     storage: {ref: jest.fn(() => {
    //         return {
    //           put: jest
    //             .fn()
    //             .mockResolvedValueOnce({
    //               ref: {getDownloadURL: jest.fn()}
    //             }),
    //         };
    //       }),
    //     },
    //   }

    //   // create a newBill
    //   const newBill = new NewBill({
    //     document,
    //     onNavigate,
    //     store,
    //     localStorage: window.localStorage,
    //   })

    //   // get handleChangeFile function
    //   const handleChangeFile = jest.fn(newBill.handleChangeFile)
    //   const file = screen.getByTestId("file")
    //   file.addEventListener("change", handleChangeFile)
    //   fireEvent.change(file, {
    //     target: {
    //       files: [new File(["image"], "image.jpg", {
    //         type: "image/jpg"
    //       })],
    //     }
    //   })

    //   // verify we have an extension .jpg
    //   expect(file.files.length).toEqual(1)

    //   // The error message should displayed "none"
    //   expect(document.querySelector("#errorMessagId").style.display).toBe("none")
    // })
  })

  //test d'intégration Post (function handleSubmit)
  describe("When I'm on NewBill page and click on submit btn", () => {
    test("Then the function handleSubmit should be called", () => {
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        })
      }
      // create a NewBill
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      // get the form
      const form = document.querySelector(`form[data-testid="form-new-bill"]`)
      // get handleSubmit function
      const handleSubmit = jest.fn(newBill.handleSubmit)
      // listen the submit
      form.addEventListener("submit", handleSubmit)
      // simulated a btn type "submit"
      fireEvent.submit(form)
      // test
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
