#ifndef __ILOGGER_H__
#define __ILOGGER_H__

#include "../../inc.h"

namespace minacoin::util::logging {
    class ILogger {
        public: 
            virtual void info(const std::string& fmt, ...) const __abstract_method__; 
            virtual void warn(const std::string& fmt, ...) const __abstract_method__;    
            virtual void error(const std::string& fmt, ...) const __abstract_method__; 
            virtual void debug(const std::string& fmt, ...) const __abstract_method__; 
            virtual void critical(const std::string& fmt, ...) const __abstract_method__; 
    }; 
}

#endif 