#ifndef __SPDLOGGER_FACTORY_H__
#define __SPDLOGGER_FACTORY_H__

#include <string> 
#include "ilogger.hpp"
#include "spdlogger.hpp"
#include "iloggerfactory.hpp"

namespace minacoin::util::logging {
    class SpdLoggerFactory: public ILoggerFactory {
        public: 
            ILogger* createLogger() override {
                return new SpdLogger();
            }
            
            ILogger* createLogger(const std::string& tag) override {
                return new SpdLogger(tag);
            }
    }; 
}

#endif 
