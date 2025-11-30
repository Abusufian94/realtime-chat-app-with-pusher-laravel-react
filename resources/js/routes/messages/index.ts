import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessagesPageController::index
* @see app/Http/Controllers/MessagesPageController.php:13
* @route '/messages'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const messages = {
    index: Object.assign(index, index),
}

export default messages