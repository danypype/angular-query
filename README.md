#angular-query

AngularJS directive to make custom queries on an array of objects.

#Usage

1. Clone this repo:

    `$ git clone https://github.com/danypype/angular-query.git`

2. Place the angular-query.js file in your project directory.

3. Link the file in your html, below AngularJS:

    `<script src="js/angular-query">`

4. Require the `query` module from the application module:

    `angular.module('myApp', ['query']`

5. Now you can use the directive like this:

    ```
    <ul query="dataSet" options="queryOptions" results="queryResults">
        <!-- Here you can do whatever you need with queryResults
        Like a ng-repeat. -->
        <li ng-repeat="result in queryResults">
            ...
        </li>
    </ul>
    ```
    
#Query options

You must pass your query options to the directive through the `options` attribute as seen above.

You must pass an object structured as follows:

```
$scope.queryOptions = {
    anyProperty: number|string|boolean,
    $and: array,
    $or: array,
    $sort: {
        by: string,
        reverse: boolean
    },
    $imit: integer
}
```

#Operators

You can use the following operators on your queryOptions object:

- `$and` -> Conjunction. Must be an array of key-value hashes.

    Example: `$and: [{inStock: true}, {ref: 123}]` returns the items which are in stock and the reference is 123.

- `$or` Disjunction. Must be an array of key-value hashes.

    Example: `$or: [{ref: 456}, {ref: 123}]` returns the items of reference 456 or 123.

- `$gt` -> Greater than.

    `$gte` -> Greater than or equal.
    
    `$lt` -> Less than.
    
    `$lte` ->Less than or equal.

    Examples: 
    
        `price: {$gt: 20}` returns the items which price is greather than 20. 
        
        `price: {$lte: 21}` returns the items which price is less than 21 or equal.

    Also can be used with `$and` or `$or`:
    
        `$and: [{price: {$gte: 20}}, {price: {$lte: 100}}]` returns the items which price is greater than 20 or equal and less than 100 or equal.
    
        `$or: [{price: {$lt: 100}}, {inStock: false}]` returns the items which price is less than 100 or aren't in stock.

- `$order` -> Order results. Must have the following properties:
    
    `by` name of property to order by.
    
    `reverse` must be either true or false to order desc or asc.

    Example: `$order: {by: 'price', reverse: true}` orders the items by price descending.

- `$limit` -> Limit results length.

    Example: Show the first 100 items which price is greater than 20. 
    ```
    {
        price: {$gt: 20},
        $limit: 100
    }
    ```

- You also can specify direct properties:

    Examples:
    
        `"category.id": 1` returns the items which belong to the category with id 1. 
    
        `ref: 123` returns the items with reference 123.
