#include <chrono> 
#include "timestamp.h"

using namespace std::chrono;

namespace minacoin::util {
	unsigned int timestamp() {
		return (duration_cast< milliseconds >(
			system_clock::now().time_since_epoch()
		)).count();
	}
}

