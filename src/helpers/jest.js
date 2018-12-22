import { implementsInterface } from 'implements-interface'

export function setupCustomMatchers (expect) {
  expect.extend({
    toImplement (object, Interface) {
      try {
        implementsInterface(object, Interface)
        return {
          message: () => `expected object not to implement ${Interface.name}.`,
          pass: true
        }
      } catch (e) {
        return {
          message: () => e.message,
          pass: false
        }
      }
    }
  })
}
