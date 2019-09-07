#ifndef __TIMESTAMP_H__
#define __TIMESTAMP_H__

#include <chrono> 

using namespace std::chrono;

namespace minacoin { namespace lib { namespace util { 
	uint timestamp() {
		return (duration_cast< milliseconds >(
			system_clock::now().time_since_epoch()
		)).count();
	}
}}}

#endif
