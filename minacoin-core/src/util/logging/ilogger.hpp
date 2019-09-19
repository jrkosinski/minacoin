#ifndef __ILOGGER_H__
#define __ILOGGER_H__

#include "../../inc.h"

//TODO: add or modify methods to take std::string
namespace minacoin::util::logging {
    class ILogger {
        public: 
            virtual void info(const char* fmt, ...) __abstract_method__; 
            virtual void warn(const char* fmt, ...) __abstract_method__;    
            virtual void error(const char* fmt, ...) __abstract_method__; 
            virtual void debug(const char* fmt, ...) __abstract_method__; 
            virtual void critical(const char* fmt, ...) __abstract_method__; 
    }; 
}

#endif 