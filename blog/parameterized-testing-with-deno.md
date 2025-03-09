---
title: Running parameterized tests in Deno
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  A quick guide to running parameterized tests in Deno.
date: '2025-03-09'
thumb_image: images/deno_tests_sm.png
image: images/deno_tests_b.png
layout: post
---

When writing tests, it's common to want to run the same test with different inputs. This is called parameterized testing, and it's a great way to ensure that your code behaves correctly under different conditions.

This is usually done by writing a single test function that takes parameters, and then calling that function with different inputs. Here is an example in C# using NUnit:

```csharp
[TestCase(1, 2, 3)]
[TestCase(2, 3, 5)]
[TestCase(3, 4, 7)]
public void TestAdd(int a, int b, int expected)
{
    var result = a + b;
    Assert.AreEqual(expected, result);
}
```

## Testing in Deno

In Deno, we can take advantage of the integrated testing library by using `Deno.test()` to define our tests. We can further split our tests into separate steps, like so:

```js
Deno.test("When activating the flux capacitor", (t) => {
  const capacitor = activateFluxCapacitor();
  
  t.step("It should generate 1.21 gigawatts of power", () => {
    const power = capacitor.generatePower();
    t.assertEquals(power, 1.21);
  });

  t.step("It should travel through time", () => {
    const time = capacitor.travelThroughTime();
    t.assertEquals(time, "1985");
  });
});
```

Sometimes however we want to test a function with multiple inputs. An easy way to do so would be to iterate over an array of inputs and call the test function for each input. This can be a bit cumbersome, especially if we have a lot of inputs:

```js
Deno.test("TestAdd", () => {
  const testCases = [
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 3, expected: 5 },
    { a: 3, b: 4, expected: 7 },
  ];

  for (const input of testCases) {
    const { a, b, expected } = input;
    const result = a + b;
    assertEquals(result, expected);
  }
});
```

A disadvantage of this approach is that if any of the test cases fail, the test will stop running and we won't know the results of the remaining test cases. The test runner will also simply mark the whole test as failed, without providing any information about which test case failed!

## How to run parameterized tests in Deno

After searching online for a bit and finding nothing helpful, I decided to take a look at how Deno's developers write tests.
A quick github search took me to [the tests for Deno's `serve` function](https://github.com/denoland/deno/blob/0ef3f6ba887d7aed2d94c8b622563d13bfecda2c/tests/unit/serve_test.ts#L2441). Here we can see that they use a helper function to generate multiple test cases.

The trick is that they call `Deno.test()` _inside_ the helper function!

We can adapt this trick in our tests like so:

```js
function testAdd(a, b, expected) {
  Deno.test(`TestAdd(${a}, ${b})`, () => {
    const result = a + b;
    assertEquals(result, expected);
  });
}

testAdd(1, 2, 3);
testAdd(2, 3, 5);
testAdd(3, 4, 7);
```

Another approach is to use an array and a for loop:

```js
const testCases = [
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 3, expected: 5 },
  { a: 3, b: 4, expected: 7 },
];

for(const {a, b, expected} of testCases) {
  Deno.test(`TestAdd(${a}, ${b})`, () => {
    const result = a + b;
    assertEquals(result, expected);
  });
}
```

This way, if any of the test cases fail, the test runner will still run the remaining test cases and provide information about which test case failed.

Additionally, by specifying unique test names in each Deno.test() call, we can easily identify which test case failed!


### A note on the Visual Studio Code Deno extension

At the time of writing, you won't be able to run individual tests in Visual Studio Code from the test file itself (ie you won't see a "Run Test" button next to each test). 

You can still run the whole test file by right-clicking on the file and selecting "Run Test" from the context menu.

Once you've done that, the tests will also be visible in the "Testing" tab, where you can see the results of each test case.

## Conclusion

Test files in Deno are just regular TypeScript files, so you can use any TypeScript feature you like to write your tests. This includes using helper functions to generate multiple test cases, as we've seen in this article.

The key takeaway is that you can use `Deno.test()` inside a helper function or a for loop to generate multiple test cases. This allows you to run parameterized tests in Deno, and get detailed information about which test cases failed.
