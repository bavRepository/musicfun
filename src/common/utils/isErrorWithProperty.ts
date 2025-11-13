export function isErrorWithProperty<T extends string>(error: unknown, property: T): error is Record<T, string> {
  return (
    typeof error === 'object' && // Проверяем, что error – это объект
    error != null && // Убеждаемся, что это не null
    property in error && // Проверяем, что у объекта есть свойство 'message'
    typeof (error as Record<string, unknown>)[property] === 'string' // Убеждаемся, что это строка
  )
}

//<T extends string> значит что T у нас в любом случае будет стринг
// is Record<T, string> значит что у нас первый аргумент T это будет или мессейдж или еррор или то что передадим
