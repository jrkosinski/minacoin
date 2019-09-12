#ifndef __ILOGGER_H__
#define __ILOGGER_H__

namespace minacoin::lib::util::logging {
    class ILogger {
        public: 
            virtual void info(const char* fmt, ...) =0; 
            virtual void warn(const char* fmt, ...) =0;    
            virtual void error(const char* fmt, ...) =0; 
            virtual void debug(const char* fmt, ...) =0; 
            virtual void critical(const char* fmt, ...) =0; 
    }; 
}

#endif 