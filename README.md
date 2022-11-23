# 03-angular-CRUD

Estoy utilizando una implementación del *Observer Pattern*. Debido a la naturaleza de las operaciones, quizás habría sido más fácil simplemente incluir el formulario como componente hijo dentro de la tabla de visualización de datos (o viceversa). No obstante, pensando en la posible reutilización de la lógica y con la intención de <s>complicarme la vida</s> poner en práctica otros conceptos, he decidido implementar la siguiente estrucutra:

- `src/app/components`: Aquí residen los componentes, cada uno en su propia carpeta y, de primeras, totalmente independientes e **incomunicados** entre sí. En la fase `OnInit` del ciclo de vida es cuando se suscriben a los observables del servicio.
  - `./table/table.component.ts`: Este es el componente más ligero. Tan solo sirve para **visualizar los datos del servicio**. Está también dotado con dos métodos que sirven como forma de llamar a los métodos homónimos del servicio de los usuarios.
  - `./form/form.component.ts`: Sin duda el componente con más lógica de la aplicación. Salvando las propiedades que únicamente sirven para representar información en la vista (como `countryOptions`), mantiene una **comunicación constante con el servicio**. Al igual que el componente de tabla, también manipula los datos del servicio llamando a los métodos homónimos y pasándoles la información necesaria. 
- `src/app/interfaces`: Por lo pronto tan solo cuenta con un archivo `user.interface.ts`, que se encarga de tipar los datos obtenidos del formulario. Ha sido especialmente útil a la hora de detectar errores en la lógica y para trabajar más cómodamente con el IntelliSense.
- `src/app/pipes`: Gracias al `render-true.pipe.ts`, ha sido muy fácil implementar la lógica para sustituir el `true` de la suscripción por un check. Por supuesto, esto tan solo afecta a la vista de la tabla, **no a los datos en sí**.
- `src/app/services`: En el `user.service.ts` se unifica la lógica de la aplicación. Hago uso de los **BehaviorSubject** de **RxJs** para sincronizar todas las vistas que usan el servicio. La lógica para alterar estos BS también se encuentra aquí, y se llaman desde los componentes pasándoles el nuevo valor que tengan que usar para calcular el siguiente estado.
- `src/app/types`: Por lo pronto, tan solo contiene el archivo `operations.ts`, desde el cual se exporta el tipo `type Operation = 'update' | 'create' | 'editing'`. Este tipo ha sido especialmente útil a la hora de establecer la lógica de qué operación tiene que realizar el componente de formulario.


## Posibles mejoras
Presumo que hay mucho espacio para mejorar la estructura y la lógica. Entre otras cosas que muy posiblemente se me estén escapando, se me ocurre:

- Debería haber tipado los datos de salida del formulario con una interfaz diferente a la del usuario.
- Aún no hay **validaciones** implementadas. Aunque el MVP se haya alcanzado, aún dista mucho de ser un producto perfecto; y necesariamente hay que pasar por las validaciones para ello.
- En el componente [form](./src/app/components/form/form.component.ts) utilizo el lifecyle hook `ngDoCheck` para detectar cuándo cambia el tipo de operación y actuar en consecuencia. No termino de estar contento con esa opción porque me conta que `DoCheck` consume muchos recursos. Sin embargo, al tratarse de una aplicación tan pequeña y tan solo evalúo una propiedad, me parece que cumple bastante bien con su cometido. Se me ocurre que una aproximación mejor habría sido utilizar un `useFactory`, lo cual nos habría ahorrado también la lógica de `operationType`. 