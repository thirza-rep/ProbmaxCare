<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        <!-- Styles -->
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="antialiased bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="max-w-7xl mx-auto p-6 lg:p-8 text-center">
             <h1 class="text-4xl font-bold text-gray-900 mb-4">ProbmaxCare Backend</h1>
             <p class="text-gray-600 mb-8">API server is running correctly.</p>
             <div class="flex justify-center space-x-4">
                 <a href="/api/test" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Test API</a>
                 <a href="/api/db-test" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Test DB</a>
             </div>
        </div>
    </body>
</html>
