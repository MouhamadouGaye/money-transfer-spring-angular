// package com.mgaye.moneytransfer.security;

// import java.io.IOException;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.mgaye.moneytransfer.service.UserService;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.Cookie;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// // @Component
// // public class JwtFilter extends OncePerRequestFilter {
// //     private final JwtUtil jwtUtil;
// //     private final UserService userService;

// //     public JwtFilter(JwtUtil jwtUtil, UserService userService) {
// //         this.jwtUtil = jwtUtil;
// //         this.userService = userService;
// //     }

// //     @Override
// //     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
// //             throws ServletException, IOException {

// //         String token = null;

// //         // read JWT from cookie
// //         if (request.getCookies() != null) {
// //             for (Cookie cookie : request.getCookies()) {
// //                 if ("jwt".equals(cookie.getName())) {
// //                     token = cookie.getValue();
// //                 }
// //             }
// //         }

// //         if (token != null) {
// //             String username = jwtUtil.extractUsername(token);

// //             UserDetails userDetails = userService.loadUserByUsername(username);
// //             UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
// //                     userDetails.getAuthorities());

// //             SecurityContextHolder.getContext().setAuthentication(auth);
// //         }

// //         chain.doFilter(request, response);
// //     }
// // }
// @Component
// public class JwtFilter extends OncePerRequestFilter {

//     private final JwtUtil jwtUtil;
//     private final UserDetailsService userDetailsService;

//     public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
//         this.jwtUtil = jwtUtil;
//         this.userDetailsService = userDetailsService;
//     }

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain)
//             throws ServletException, IOException {

//         String token = null;
//         if (request.getCookies() != null) {
//             for (Cookie cookie : request.getCookies()) {
//                 if ("jwt".equals(cookie.getName())) {
//                     token = cookie.getValue();
//                 }
//             }
//         }

//         if (token != null) {
//             String username = jwtUtil.extractUsername(token);
//             UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//             UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
//                     userDetails.getAuthorities());
//             SecurityContextHolder.getContext().setAuthentication(auth);
//         }

//         filterChain.doFilter(request, response);
//     }
// }

package com.mgaye.moneytransfer.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {

    Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;

        // Extract JWT from cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        if (token != null) {
            try {
                String username = jwtUtil.extractUsername(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    if (jwtUtil.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                // Optionally log invalid/expired token
                logger.warn("JWT validation failed: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
