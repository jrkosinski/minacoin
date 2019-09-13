#include "spdlogger.hpp"
#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

namespace minacoin::lib::util::logging {
    
    SpdLogger::SpdLogger(const std::string& tag) { 
        auto console = spdlog::stdout_color_mt("console");    
        auto err_logger = spdlog::stderr_color_mt("stderr");    
        spdlog::set_default_logger(spdlog::get("console")); 
        
        this->_tag = tag;
    }
    
    void SpdLogger::info(const char* fmt, ...) {
        va_list args;
        va_start(args, fmt);
        this->info(fmt, args);
        va_end(args);
    }
    
    void SpdLogger::warn(const char* fmt, ...) {
        va_list args;
        va_start(args, fmt);
        this->warn(fmt, args);
        va_end(args);
    }
    
    void SpdLogger::error(const char* fmt, ...) {
        va_list args;
        va_start(args, fmt);
        this->error(fmt, args);
        va_end(args);
    }
    
    void SpdLogger::debug(const char* fmt, ...) {
        va_list args;
        va_start(args, fmt);
        this->debug(fmt, args);
        va_end(args);
    }
    
    void SpdLogger::critical(const char* fmt, ...) {
        va_list args;
        va_start(args, fmt);
        this->critical(fmt, args);
        va_end(args);
    }
            
    void SpdLogger::info(const char* fmt, va_list args) {
        char buffer[255]; 
        sprintf(buffer, fmt, args); 
        spdlog::info(buffer);
    }
            
    void SpdLogger::warn(const char* fmt, va_list args) {
        char buffer[255]; 
        sprintf(buffer, fmt, args); 
        spdlog::warn(buffer);
    }
            
    void SpdLogger::error(const char* fmt, va_list args) {
        char buffer[255]; 
        sprintf(buffer, fmt, args); 
        spdlog::error(buffer);
    }
            
    void SpdLogger::debug(const char* fmt, va_list args) {
        char buffer[255]; 
        sprintf(buffer, fmt, args); 
        spdlog::debug(buffer);
    }
            
    void SpdLogger::critical(const char* fmt, va_list args) {
        char buffer[255]; 
        sprintf(buffer, fmt, args); 
        spdlog::critical(buffer);
    }
}
