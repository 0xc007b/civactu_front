<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <header class="relative">
        <div class="px-4 mx-auto sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 lg:h-20">
                <div class="flex-shrink-0">
                    <router-link to="/" class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                        </div>
                        <span class="text-xl font-semibold text-slate-900">CivActu</span>
                    </router-link>
                </div>

                <button type="button" class="inline-flex p-1 text-slate-900 transition-all duration-200 border border-slate-300 rounded lg:hidden focus:bg-slate-100 hover:bg-slate-100">
                    <!-- Menu open: "hidden", Menu closed: "block" -->
                    <svg class="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>

                    <!-- Menu open: "block", Menu closed: "hidden" -->
                    <svg class="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">
                    <router-link to="/auth/login" class="text-base font-semibold text-slate-900 transition-all duration-200 hover:text-slate-600"> Connexion </router-link>

                    <router-link to="/auth/register" class="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-white bg-blue-600 border-2 border-blue-600 rounded hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 focus:bg-blue-700 focus:border-blue-700" role="button"> S'inscrire </router-link>
                </div>
            </div>
        </div>
    </header>

    <section class="py-10 sm:py-16 lg:py-24">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                <div>
                    <h1 class="text-4xl font-bold text-slate-900 sm:text-6xl lg:text-7xl">
                        Participez à la vie de
                        <div class="relative inline-flex">
                            <span class="absolute inset-x-0 bottom-0 border-b-[30px] border-blue-400"></span>
                            <span class="relative text-4xl font-bold text-slate-900 sm:text-6xl lg:text-7xl">votre ville.</span>
                        </div>
                    </h1>

                    <p class="mt-8 text-base text-slate-600 sm:text-xl">CivActu vous permet de vous exprimer sur les enjeux locaux, de suivre l'actualité de votre commune et de participer activement à la démocratie participative.</p>

                    <div class="mt-10 sm:flex sm:items-center sm:space-x-8">
                        <router-link to="/auth/register" class="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 rounded" role="button"> Commencer maintenant </router-link>

                        <!-- <a href="#" title="" class="inline-flex items-center mt-6 text-base font-semibold transition-all duration-200 sm:mt-0 hover:opacity-80 text-slate-900">
                            <svg class="w-10 h-10 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path fill="#3B82F6" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Voir la démo
                        </a> -->
                    </div>
                </div>

                <div>
                    <img class="w-full rounded shadow-2xl" src="https://plus.unsplash.com/premium_photo-1668061706855-26d4cf0f6248?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Participation citoyenne" />
                </div>
            </div>
        </div>
    </section>

    <!-- Section fonctionnalités -->
    <section class="py-16 sm:py-24 bg-white">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Pourquoi choisir CivActu ?
                </h2>
                <p class="mt-4 text-lg text-slate-600">
                    La plateforme qui rapproche citoyens et élus locaux
                </p>
            </div>

            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <!-- Fonctionnalité 1 -->
                <div class="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div class="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-900 mb-2">Opinions citoyennes</h3>
                    <p class="text-slate-600">Exprimez-vous sur les sujets qui vous tiennent à cœur et participez aux débats locaux.</p>
                </div>

                <!-- Fonctionnalité 2 -->
                <div class="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div class="w-12 h-12 bg-green-600 rounded flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-900 mb-2">Actualités locales</h3>
                    <p class="text-slate-600">Restez informé des dernières nouvelles et décisions de votre commune.</p>
                </div>

                <!-- Fonctionnalité 3 -->
                <div class="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div class="w-12 h-12 bg-teal-600 rounded flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-900 mb-2">Dialogue avec les élus</h3>
                    <p class="text-slate-600">Communiquez directement avec vos représentants locaux et suivez leurs actions.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section CTA -->
    <section class="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-teal-600">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-white sm:text-4xl">
                    Prêt à vous impliquer ?
                </h2>
                <p class="mt-4 text-lg text-blue-100">
                    Rejoignez des milliers de citoyens qui participent déjà à la vie de leur commune.
                </p>
                <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <router-link to="/auth/register" class="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-blue-600 bg-white hover:bg-slate-50 transition-all duration-200 rounded"> 
                        Créer un compte gratuitement
                    </router-link>
                    <router-link to="/auth/login" class="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200 rounded"> 
                        J'ai déjà un compte
                    </router-link>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white py-12">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Logo et description -->
                <div class="md:col-span-2">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                        </div>
                        <span class="text-xl font-semibold">CivActu</span>
                    </div>
                    <p class="text-slate-400 max-w-md">
                        La plateforme de participation citoyenne qui vous permet de vous impliquer dans la vie de votre commune et de faire entendre votre voix.
                    </p>
                </div>

                <!-- Liens -->
                <div>
                    <h3 class="font-semibold mb-4">Plateforme</h3>
                    <ul class="space-y-2 text-slate-400">
                        <li><a href="#" class="hover:text-white transition-colors">Fonctionnalités</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Tarification</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Support</a></li>
                    </ul>
                </div>

                <!-- Légal -->
                <div>
                    <h3 class="font-semibold mb-4">Légal</h3>
                    <ul class="space-y-2 text-slate-400">
                        <li><a href="#" class="hover:text-white transition-colors">Confidentialité</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Conditions</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
                <p>&copy; 2025 CivActu. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
  </div>
</template>