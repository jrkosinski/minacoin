#ifndef __SPDLOGGER_H__
#define __SPDLOGGER_H__

#include <string> 
#include "ilogger.hpp"
#include "spdlog/spdlog.h"

namespace minacoin::lib::util::logging {
    class SpdLogger: public ILogger {
        private: 
            std::string _tag; 
            
        public: 
            SpdLogger() : SpdLogger("") { }
            SpdLogger(const std::string& tag); 
            
        public: 
            virtual void info(const char* fmt, ...) override;
            virtual void warn(const char* fmt, ...) override;
            virtual void error(const char* fmt, ...) override;
            virtual void debug(const char* fmt, ...) override;
            virtual void critical(const char* fmt, ...) override;
            
        private: 
            void info(const char* fmt, va_list args);
            void warn(const char* fmt, va_list args);
            void error(const char* fmt, va_list args);
            void debug(const char* fmt, va_list args);
            void critical(const char* fmt, va_list args);
    }; 
}

#endif 