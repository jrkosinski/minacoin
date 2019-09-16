#ifndef __TEST_H__
#define __TEST_H__

#include "../../src/ioc.hpp"
#include "../../src/server/server.hpp"

minacoin::IOC* initializeIoc();

void addDataToBlockchain(minacoin::server::Server* server);

#endif 