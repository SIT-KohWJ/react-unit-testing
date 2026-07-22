# **React Unit Testing with Jest and React Testing Library**

> 📄 **Static Code Analysis (ICT2216 – Lab 8):** ESLint (with security plugins) and
> GitHub CodeQL are configured for this project. See
> [STATIC-ANALYSIS.md](STATIC-ANALYSIS.md) for the full setup, how to run it
> locally (`npm run lint` / `npm run lint:sarif`), and the CI workflows.

### **What is Jest ?**
Jest is a JavaScript testing framework that is used for unit testing, snapshot testing, and coverage reporting. Jest can be used to test React components, and it is also often used with React Native.

### **What is React Testing Library ?**
React Testing Library is a JavaScript testing utility built specifically to test React components. It simulates user interactions on isolated components and asserts their outputs to ensure the UI is behaving correctly.

React Testing Library provides virtual DOMs for testing React components.

Any time we run tests without a web browser, we must have a virtual DOM to render the app, interact with the elements, and observe if the virtual DOM behaves like it should (like changing the width of a div on a button click).

### **Types of Testing?**
- **Unit Testing:** 
  - Test the individual blocks of an application such as a class or a function or a component.
  - Each unit is tested in isolation,independent of other units
  - Dependencies are mocked
  - Takes less time to test
  - Easy to write and maintain

- **Integration Testing:** 
  - Test the combination of units and ensure they are working together
  - Take more time than unit tests

- **End to End(E2E) Testing:** 
  - Test the entire application flow and ensure it works as designed from start to finish
  - Involve real UI, database, API
  - Take longest time
  - Cost implication as you interact with real api that maybe charged based on no. of requests

### **What is TDD?**
  Test Driven Development (TDD) is a software development practice that focuses on creating unit test cases before developing the actual code. It is an iterative approach combining programming, unit test creation, and refactoring.  


### **How Is a Test Structured?**
Testing involves checking if your code is functioning as it's supposed to by comparing the expected output with the actual output.

### **What to Test?**

- If a component renders with or without props
- How a component renders with state changes
- How a component reacts to user interactions

### **What Not to Test**
Testing most of your code is important, but here are some things you do not need to test:

- **Actual Implementation:** You do not need to test the actual implementation of a functionality. Just test if the component is behaving correctly.

- **Third Party libraries:** If you are using any third party libraries like Material UI, no need to test those – they should already be tried and tested.

### **How to group Tests?**
**Using describe**, we can group multiple test.
```ts
// describe(name,fn) Syntax

describe("Group",()=>{
  test("test1",()=>{})
  test("test2",()=>{})
})
```

### **Here are some methods and important points regarding jest and RTL:**

- **jest.mock() -** Jest.Mock works best when wanting to mock entire files: which contain named or default exports or specific named or default exports of a file for the entire duration of the test.

    Use jest.mock before render.

- **jest.spyOn -** Jest.SpyOn works best when you want to conditionally mock an exported method or named function within your test suite.

    ``` jest.spyOn(moduleName, “methodName”); ```

    Mock can be restored to original fn using .mockRestore which is only available with spyOn

 -  **jest.fn() -** simple way to mock a function

 -  **.mockImplementation() -** It is used to mock function to implement the custom functionality

    ```js
    const addMock = jest.spyOn(math, "add");

    // override the implementation
    addMock.mockImplementation(() => "mock");  
    ```  

- **waitFor -** waitFor is an API provided by React testing library to wait for the wrapped assertions to pass within a certain timeout window.
    ``` 
    await waitFor(() => {
    expect(getByText("David")).toBeInTheDocument();
    });
    ```

- **act -** When writing UI tests, tasks like rendering, user events, or data fetching can be considered as “units” of interaction with a user interface. react-dom/test-utils provides a helper called act() that makes sure all updates related to these “units” have been processed and applied to the DOM before you make any assertions.

    ```js
        act(() => {
        // render components
            });
        // make assertions
    ```

- **@testing-library/jest-dom -** 
The @testing-library/jest-dom library provides a set of custom jest matchers that you can use to extend jest. These will make your tests more declarative, clear to read and to maintain.

- **How to find elements on the page using queries  ?** 
    
    - **getByRole** finds an element by the given role. 
    
      You can see a list of roles for different elements [here](https://www.w3.org/TR/html-aria/#docconformance).
      
      ```html
      <input placeholder='Enter name'/>
      <button> Submit </button> 
      ```

      ```js
      screen.getByRole('button', { name: /submit/i })
      ```

      ```js
      const inputElement = screen.getByRole('textbox')
      ```

      For multiple elements with same role we can use *getByRole* with name or other attribute otherwise it will throw error.

      ```html
      <button> Submit </button>
      <button> Apply</button>
      ```

      ```js
      const submitButton = screen.getByRole('button', { name: /submit/i });
      const applyButton = screen.getByRole('button', { name: /apply/i });
      ```
   -----

    - **getByPlaceholderText** if your input has a placeholder.

      ```html
      <input placeholder='Enter name'/>
      ```

      ```js
      const nameInput = screen.getByPlaceholderText(/enter name/i);
      ```
    ----

    - **getByLabelText()** if your input has a label.

       **Note:** *htmlFor as well as element enclosed with label tag with their inner text works with getByLabelText().*

      ```js
      <label htmlFor='password'> Enter password</label>
      <input type='password' id='password'/>
      ```

      ```js
        const passwordInput = screen.getByLabelText(/enter password/i);
      ```

      For multiple element with same label name, we can use a second argument object with attribute **selector** which accepts value as HTML type. 

      ```js
        const passwordInput = screen.getByLabelText(/enter password/i,{
          selector:"input"
        });
      ```
    - **getByText** will return all elements that have text node matches textContext with text.

      Typically used for paragraph,div,span elements.

      ```html
      <p>This is paragraph</p>
      ```

      ```js
      const element = screen.getByText("This is paragraph");
      ```

    - **getByDisplayValue** will return element that matches given display value.

      Typically used for input,select or textarea.

      ```html
      <input type="test" value="test"/>
      ```

      ```js
      const element = screen.getByDisplayValue("test");
      ```      

    - **getByAltText** will return element that matches given alt text.

      Typically used for input,img or other custom element.

      ```html
      <img src="http://img.com" alt="test"/>
      ```

      ```js
      const element = screen.getByAltText("test");
      ```    

    - **getByTitle** will return element that matches given title.

      ```html
      <span title="test"></span>
      ```

      ```js
      const element = screen.getByTitle("test");
      ```     

    - **getByTestId** will return element that matches data-testid attribute.

      ```html
      <span data-testid="test"></span>
      ```

      ```js
      const element = screen.getByTestId("test");
      ``` 
  ***Priority to use these methods to find elements:***
    - getByRole
    - getByLabelText
    - getByPlaceholderText
    - getByText
    - getByDisplayValue
    - getByAltText
    - getByTitle
    - getByTestId      

- React Testing Library (RTL) gives developers methods to find elements on the component it rendered for testing, these methods are called queries. There are 3 main types of RTL query types namely get, find and query.

    - **get:**
       - **getBy:** returns the matching node, however will throw an error if multiple matches or no matches are found.
       - **getAllBy:** returns an array of matching nodes if at least one match is found and throws an error if no match is found.
       
      ***Tip :*** Use these methods if you expect the element / elements to be present upon query.   

    - **query:**
       - **queryBy:** returns the matching node if one match is found and null if no match is found, however will throw an error if multiple matches are found.
       - **queryAllBy:** returns an array of matching nodes if at least one match is found and an empty array if no match is found.
       
      ***Tip :*** Use these methods if you are looking to confirm presence of an element / elements. Use this to test if element is not there.

    - **find:**
      - **find:** returns a promise that returns the matching node, however will throw an error if multiple matches or no matches are found.
       - **findAllBy:** returns a promise that returns an array of matching nodes if at least one match is found and throws an error if no match is found.
       
      ***Tip :*** Use these methods if the element / elements being queried might display asynchronously (for example, if your element is expected to only display after an event is fired consider using find as it retries the query after some time).

      **Note:** By default findBy wait for *1000ms* so to overcome this we can pass a second argument object with attribute timeout.
      ```js
      const element = await screen.findByTest("test",{
        timeout: 2000
      });
      ```

- **User Interactions:** All events return Promise.
  - **fireEvent** triggers only a change event  
  - **userEvent** full interaction, multiple events and more. It is the recommended approach.   

  **Convenience API's -** click(),dblClick(),tripleClick(),hover(),unhover()

- **logRoles -** It print out a list of all the implicit ARIA roles within a tree of DOM nodes, each role containing a list of all the nodes which match that role.

    ```jsx
    // Person.test.tsx

    import { render, logRoles } from "@testing-library/react";
    import { Person } from "./Person";

      describe("Person", () => {
        test("renders correctly", () => {
          const view = render(<Person />);
          logRoles(view.container);
        });
     });
    ```
- **logTestingPlaygroundURL() -** This method on the screen object can help you write correct queries by generating a URL when the test is run. Clicking on the link will open the Testing Playground tool with your component HTML already in place. You can then select an element to identify the best way to query an element for your test or can download Chrome extenstion.

    ```jsx
    // Person.test.tsx

    import { render, screen } from "@testing-library/react";
    import { Person } from "./Person";

    describe("Person", () => {
      test("renders correctly", () => {
        render(<Person />);
        screen.logTestingPlaygroundURL();
      });
    }); 
    ```
- **Providers**: To handle providers, pass second argument in render function with attribute wrapper.
  ```ts
    render(<App/>,{
      wrapper: AppProviders
    })
  ```    
  Also if want to use Provider for all components so instead of passing wrapper to individual render fn, we can create custom render fn [found here](https://testing-library.com/docs/react-testing-library/setup).

- **Custom Hooks**: To test custom hooks RTL provides a method *renderHook* which returns result we test with *result.current*
   ```ts
   const {result}= renderHook(useCustom);
   expect(result.current.count).toBe(0)
  ```  
  To test with custom hooks with props, we can pass a second argument with attribute *initialProps*.
  ```ts
   const {result}= renderHook(useCustom,{
    initialProps: {
      count:10
    }
   });
   expect(result.current.count).toBe(0)
  ```  

- *Some Miscellaneous points*:
  - In react project created by CRA, jest watch mode is automatically enabled and it tracks only file changes from last commit which makes the testing fast.   
  - **test.only()** will make test a particular block test and skip other blocks in a file.
  - **test.skip()** will skip a particular block and test other blocks in a file.
  - File/Folder convention:
      - Create file with .test or .spec with any extension .js/.ts/.jsx/.tsx (Ex: 1.test.ts, 2.spec.jsx)
      - or Create a folder __test__ and then create file with extension .js/.ts/.jsx/.tsx

- [React testing Library Cheatsheet.](https://testing-library.com/docs/react-testing-library/cheatsheet/)





