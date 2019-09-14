#ifndef __SPDLOGGER_H__
#define __SPDLOGGER_H__

#include <string> 
#include "ilogger.hpp"
#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

namespace minacoin::util::logging {
    constexpr size_t LOG_BUFSIZE = 2048; 
    constexpr int LOGTYPE_INFO = 1;
    constexpr int LOGTYPE_DEBUG = 2;
    constexpr int LOGTYPE_WARN = 3;
    constexpr int LOGTYPE_ERROR = 4;
    constexpr int LOGTYPE_CRITICAL = 5;
    
    class SpdlogInit {
        private:
            SpdlogInit() {
                auto console = spdlog::stdout_color_mt("console");    
                auto err_logger = spdlog::stderr_color_mt("stderr");    
                spdlog::set_default_logger(spdlog::get("console")); 
            }
            
        public: 
            static SpdlogInit* run() {
                static SpdlogInit instance;
                return &instance;
            }
    };
            
    class SpdLogger: public ILogger {
        private: 
            std::string _tag; 
            
        public: 
            SpdLogger() : SpdLogger("") { }
            
            SpdLogger(const std::string& tag) {
                SpdlogInit::run();
                this->_tag = tag;
            }            
            
        public: 
            virtual void info(const char* fmt, ...) override {
                va_list args;
                va_start(args, fmt);
                this->dolog(LOGTYPE_INFO, fmt, args);
                va_end(args);
            }
            
            virtual void warn(const char* fmt, ...) override {
                va_list args;
                va_start(args, fmt);
                this->dolog(LOGTYPE_WARN, fmt, args);
                va_end(args);
            }
            
            virtual void error(const char* fmt, ...) override {
                va_list args;
                va_start(args, fmt);
                this->dolog(LOGTYPE_ERROR, fmt, args);
                va_end(args);
            }
            
            virtual void debug(const char* fmt, ...) override {
                va_list args;
                va_start(args, fmt);
                this->dolog(LOGTYPE_DEBUG, fmt, args);
                va_end(args);
            }
            
            virtual void critical(const char* fmt, ...) override {
                va_list args;
                va_start(args, fmt);
                this->dolog(LOGTYPE_CRITICAL, fmt, args);
                va_end(args);
            }
            
        private: 
            void dolog(int logType, const char* fmt, va_list& args) {
                char buffer[LOG_BUFSIZE]; 
                char output[LOG_BUFSIZE];
                vsprintf(buffer, fmt, args); 
                addTag(output, buffer);
                
                switch(logType) {
                    case LOGTYPE_INFO: 
                        spdlog::info(output);
                        break;
                    case LOGTYPE_DEBUG: 
                        spdlog::debug(output);
                        break;
                    case LOGTYPE_WARN: 
                        spdlog::warn(output);
                        break;
                    case LOGTYPE_ERROR: 
                        spdlog::error(output);
                        break;
                    case LOGTYPE_CRITICAL: 
                        spdlog::critical(output);
                        break;
                }
            }
            
            void addTag(char* dest, char* src) {
                sprintf(dest, "%s: %s", this->_tag.c_str(), src); 
            }
    }; 
}

#endif 