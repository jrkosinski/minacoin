#ifndef __TEST_H__
#define __TEST_H__

#define __UNIT_TESTS__

#include "../../src/ioc.hpp"
#include "../../src/server/server.hpp"

minacoin::IOC* initializeIoc();

void addDataToBlockchain(minacoin::server::Server* server, size_t count);

#endif 