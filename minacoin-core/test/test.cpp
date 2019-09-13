#include "include/test.h"
#include "../src/ioc.hpp"
#include "../src/util/logging/iloggerfactory.hpp"
#include "../src/util/logging/spdloggerfactory.hpp"

using namespace minacoin;
using namespace minacoin::util;
using namespace minacoin::util::logging;

IOC* initializeIoc() {
	IOC* ioc = IOC::instance(); 
	IOC::registerService<ILoggerFactory>(std::make_shared<SpdLoggerFactory>()); 
	return ioc;
}
