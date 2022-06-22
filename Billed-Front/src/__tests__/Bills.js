/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills";
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import router from "../app/Router.js";
import mockedBills from "../__mocks__/store";

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe('When I call the billsUI function', () => {
    test('Then, Loading page should be rendered', () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
   })

  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  describe('when i click on the eye icon button', () => {
    test('then a modal should open', () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      }
      const bill = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })
      $.fn.modal = jest.fn()
      const button = screen.getAllByTestId('icon-eye')[0]
      const handleClickIconEye = jest.fn((e) => {
        e.preventDefault()
        bill.handleClickIconEye(button)
      })
      button.addEventListener('click', handleClickIconEye)
      fireEvent.click(button)
      expect(handleClickIconEye).toHaveBeenCalled()
    })

    test('then a modal should not open', () => {
      document.body.innerHTML = '<div></div>'
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(null)
      const bill = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })
      $.fn.modal = jest.fn()
      const handleClickIconEye = jest.fn()
   
      try {
      const button = screen.getAllByTestId('icon-eye')[0]
      bill.handleClickIconEye = handleClickIconEye;
      fireEvent.click(button)
      }
      catch(e) {
        expect(handleClickIconEye).not.toHaveBeenCalled()
      }
    })  
  })

  describe('when i click on the new Bill Button', () => {
    test('a new bill modal should open', () => {
      Object.defineProperty(window, 'local storage', {value: localStorageMock})
      window.localStorage.setItem(
        'user', JSON.stringify({
          type: 'employee'
        })
      )
      const html = BillsUI({data: []})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}
      const bills = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })
      const button = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e))
      button.click('click', handleClickNewBill)
      fireEvent.click(button)
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
  })

})
