<template>
    <nav class="navbar navbar-expand-lg shadow-lg fixed-top">
        <div class="container-fluid px-4">
            <a class="navbar-brand fw-bold" href="/">
                <span class="brand-icon"><i class="fa-solid fa-coins text-dark"></i></span><span class="brand-name px-2">SplitLy</span> 
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <template v-if="!userLoggedIn">
                        <li class="nav-item">
                            <a class="nav-link" href="/login"><span class="btn btn-primary login-btn">Login</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-3" href="/register"><span class="btn btn-primary signup">Sign Up</span></a>
                        </li>
                    </template>
                    <template v-else>
                        <!-- <li class="nav-item">
                            <a class="nav-link btn-primary-custom" href="/login">Login</a>
                        </li> -->
                        <li class="nav-item">
                            <a class="nav-link btn btn-primary-custom px-3" href="/register">Log Out</a>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script src="./NavBar.js" />
<style src="./NavBar.css" scoped />